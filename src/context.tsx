"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { type BeaconWallet } from "@taquito/beacon-wallet";
import {
  MichelsonMap,
  OpKind,
  WalletParamsWithKind,
  type TezosToolkit,
} from "@taquito/taquito";
import { type AccountInfo } from "@airgap/beacon-types";
import { NetworkType } from "@airgap/beacon-types";
import {
  ContextState,
  VotingStep,
} from "@/interfaces/context.interface";
import { Voter } from "@/libs/mask_ballot";
import * as nextAuth from "next-auth/react";
import * as backendApis from "@/libs/backend_apis";
import { ADMIN_WALLET } from "./constants";

export const Context = createContext<ContextState>(null!);
export const ContextProvider = (props: any) => {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(true);
  const [gateways, setGateways] = useState<{ [key: string]: string } | null>(
    null
  );
  const [tezos, setTezos] = useState<TezosToolkit | null>(null);
  const [wallet, setWallet] = useState<BeaconWallet | null>(null);
  const [acc, setAcc] = useState<AccountInfo | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState<VotingStep>(
    VotingStep.CONNECT_WALLET
  );

  const [candidates, setCandidates] = useState<ContextState["candidates"]>([]);
  const [gmail, setGmail] = useState<string | undefined>(undefined);
  const [candidatesAreInit, setCandidatesAreInit] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);


  const handleVote = async () => {
    if (!tezos) {
      console.error("Tezos toolkit is not initialized.");
      alert("Please connect your wallet before voting.");
      return;
    }

    try {
      // filter out candidates w/o address
      console.log("Voting...");
      if (!candidatesAreInit) {
        alert(
          "Candidates are not initialized. Please press the 'Vote' button later."
        );
        return;
      }

      const ballots = candidates.map((candidate) => candidate.ballot);
      const ia_signedBallots = await backendApis.register(ballots);

      // get all contracts from each candidate
      const batchOps: WalletParamsWithKind[] = await Promise.all(
        candidates.map(async (candidate, idx) => {
          // const ia_signedBallot = await backendApis.register({b1:candidate.ballot[0], b2:candidate.ballot[1]});
          const commitment = await backendApis.getCommitment(
            ia_signedBallots[idx],
            candidate.id,
            candidate.enc_pairs
          );
          const contract = await tezos.wallet.at(candidate.address!);
          const vchoice = candidate.checked !== commitment.commitment;
          console.log("Voting for candidate: ", candidate.name, candidate.checked);
          const transferParams = contract.methodsObject
            .vote({
              ballot_sig: commitment.ballot_signature[vchoice ? 1 : 0],
              mask_inv: candidate.mask_inv,
              mask: candidate.mask,
              v: ia_signedBallots[idx][vchoice ? 1 : 0],
            })
            .toTransferParams();

          return {
            kind: OpKind.TRANSACTION,
            ...transferParams,
          };
        })
      );

      const res = await tezos.wallet.batch(batchOps).send();
      await res.confirmation();
      setStep(VotingStep.VOTING_SUCCESS);
      alert(`Voted successfully! Batch operation hash: ${res.opHash}`);
    } catch (error) {
      console.error("Error while voting:", error);
      alert("Voting failed. Please try again.");
    }
  };

  const finalizeVoting = async () => {
    if (!tezos) {
      console.error("Tezos toolkit is not initialized.");
      alert("Please connect your wallet before voting.");
      return;
    }
    try {
      const results = await backendApis.getResults();
      const batchOps: WalletParamsWithKind[] = await Promise.all(
        candidates.map(async (candidate) => {
          const contract = await tezos.wallet.at(candidate.address!);
          const transferParams = contract.methodsObject
            .finalize({
              proof: results[candidate.id][1],
              result: results[candidate.id][0]
            })
            .toTransferParams();
  
          return {
            kind: OpKind.TRANSACTION,
            ...transferParams,
          };
        })
      );
      const res = await tezos.wallet.batch(batchOps).send();
      await res.confirmation();

      candidates.map(async (candidate) => {
        candidate.amount = results[candidate.id][0];
      });
    }
    catch (error) {
      console.error("Error while revealing results:", error);
      throw error;
    }
  }

  const updateVote = (id: number, checked: boolean) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
      candidate.id === id ? { ...candidate, checked: checked } : candidate
      )
    );
  };

  // Use Ghostnet temporarily
  const initTezosWallet = useCallback(async () => {
    if (tezos === null || wallet === null) {
      const _tezos = new (await import("@taquito/taquito")).TezosToolkit(
        "https://ghostnet.ecadinfra.com"
      );

      const _wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet(
        {
          name: "VOTING_APP",
          network: {
            type: NetworkType.GHOSTNET, //
            rpcUrl: "https://ghostnet.ecadinfra.com",
          },
          featuredWallets: ["temple", "kukai", "metamask", "tzsafe"],
        }
      );

      //   try {
      //     await _wallet.requestPermissions({
      //         network: {
      //             type: NetworkType.GHOSTNET,
      //         }
      //     });
      // } catch (error) {
      //     console.error("Wallet connection failed:", error);
      // }

      _tezos?.setWalletProvider(_wallet);
      setWallet(_wallet);
      setTezos(_tezos);
    }
  }, [tezos, wallet]);

  const init = useCallback(async () => {
    await initTezosWallet();
    setIsInitLoading(false);
  }, [initTezosWallet]);

  useEffect(() => {
    if (isInitLoading) {
      init();
    }
  }, [isInitLoading, init]);

  useEffect(() => {
    setIsAdmin(address? ADMIN_WALLET.includes(address) : false);
  }, [address]);

  const updateMessage = (message: string) => setMessage(message);

  const setAccount = async () => {
    setAcc(
      tezos !== null ? await wallet?.client.getActiveAccount() : undefined
    );
    setAddress((await wallet?.client.getActiveAccount())?.address);
  };

  const setStep = (step: VotingStep) => {
    if (step === currentStep) {
      return;
    }
    setCurrentStep(step);
  };

  const initCandidates = async () => {
    const data = await backendApis.getCandidates();
    const encPairs = await backendApis.askEncryptedPairs();
    const rsaN = BigInt(
      "692973201049836963740004635736578819082507909485365443699902436018047601908500734186193981258316498326562938400978222997431256301414601779088231625872823780361512532852450679735389254994070782351682258794106346609673767520507628788725326521229405877807259394408359580466622987621402768791912899130887718229254951765168351036536684401041619964071931457662280619235539160584727089144091925819361633150567054541889086484693270961875141083284602321143984725509035856524845351402598905306940783365209559241828200437568555929468381783815508913753248380067394565998544805153814673567399363236606693505793040735222618489201020286395544091708248505330816558194197590158453333208903623741047305382317302448157002724345110336907932508785112145653114664073364886446319054376654428844641972035945791789356339583339555511428826707215597114314490528568908695764997001607870447559845884056074002253614719756229420904597957419117893841846102370298338835269337928107229527112876946054888638694388354541796990152731769206013406234053672261630158020537935456579396931794296518094452144899770364176978066337475826378376071763127206392365983505108885598015565936652274738612404863875862832180953020836163096565721135456196330956641693960863997087871193467"
    );
    const rsaV = BigInt("65537");
    const voter = new Voter();

    const InitializedCandidates = await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        const id = value.id;
        const imageURL = value.img;
        const name = value.names;
        const description = value.description;

        // get encrypted pairs
        const candidateEncPairs = encPairs[id];
        if (!candidateEncPairs) {
          throw new Error(`Mismatch in candidate ID: ${id}`);
        }
        voter.receiveEncPairs(candidateEncPairs);

        // mask ballot
        const ballot = voter.generateBallot(rsaN, rsaV);
        if (!voter["mask"] || !voter["maskInv"]) {
          throw new Error(`Mask generation failed for candidate: ${name}`);
        }
        // const ia_signedBallot = await backendApis.register(ballot);
        // const commitment = await backendApis.getCommitment(ia_signedBallot, id, candidateEncPairs);

        return {
          id: id,
          imageURL: imageURL,
          name: name,
          description: description,
          address: value.address,
          checked: false,
          mask: voter["mask"] as bigint,
          mask_inv: voter["maskInv"] as bigint,
          ballot: ballot,
          enc_pairs: candidateEncPairs,
          // ia_ballot_sig: [ia_signedBallot.b1, ia_signedBallot.b2] as [bigint, bigint],
          // va_ballot_sig: commitment.ballot_signature as [bigint, bigint],
          // commitment_bit: commitment.commitment,
        };
      })
    );
    setCandidates(InitializedCandidates);
    console.log("Candidates are initialized.");
    setCandidatesAreInit(true);
  };

  useEffect(() => {
    console.log("Current step: ", currentStep);
    switch (currentStep) {
      case VotingStep.CONNECT_WALLET:
        break;
      case VotingStep.VOTING:
        initCandidates();
        break;
      case VotingStep.VOTING_SUCCESS:
        break;
      case VotingStep.TALLY_PENDING:
        break;
      case VotingStep.TALLY_COMPLETED:
        break;
    }
  }, [currentStep]);

  const syncTaquito = async () => {
    // We check the storage and only do a permission request if we don't have an active account yet
    // This piece of code should be called on startup to "load" the current address from the user
    // If the activeAccount is present, no "permission request" is required again, unless the user "disconnects" first.
    await initTezosWallet();
    let activeAccount = await wallet!.client.getActiveAccount();
    if (activeAccount === undefined) {
      await wallet!.clearActiveAccount();
      await wallet!
        .requestPermissions()
        .then((response) => {
          console.log(response);
        })
        .catch((e) => console.error(e));
    }
    // setTezos(tezos)
    // setWallet(wallet)
    const userAddress = await wallet?.getPKH();
    const userAccount = await wallet?.client.getActiveAccount();

    if (userAddress && userAccount) {
      setAddress(userAddress);
      setAcc(userAccount);

      // update current step to login_google
      setCurrentStep(VotingStep.LOGIN_GOOGLE);
    } else {
      console.error("Failed to retrieve user account or address.");
    }
  };

  const disconnect = async () => {
    console.log("disconnect wallet");
    // This will clear the active account and the next "syncTaquito" will trigger a new sync
    await wallet!.client.clearActiveAccount();
    setAddress(undefined);
    setAcc(undefined);
    setCurrentStep(VotingStep.CONNECT_WALLET);
  };

  const signInGoogle = async (callbackUrl: string = "") => {
    console.log("sign in google");
    const session = await nextAuth.getSession();
    if (session) {
      await signOutGoogle();
    }

    let isSuccess = false;

    const result = await nextAuth.signIn("google", {
      redirect: callbackUrl === "",
      callbackUrl,
    });

    isSuccess = result ? result.ok : false;
    return isSuccess;
  };

  const signOutGoogle = async () => {
    await nextAuth.signOut({ redirect: false });
  };

  return (
    <Context.Provider
      value={{
        isInitLoading,
        gateways: gateways ?? {},
        tezos,
        wallet,
        acc,
        address,
        message,
        currentStep,
        candidates,
        gmail,
        isAdmin,
        setStep,
        signInGoogle,
        signOutGoogle,
        updateMessage,
        setAccount,
        initCandidates,
        syncTaquito,
        disconnect,
        handleVote,
        updateVote,
        finalizeVoting
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
