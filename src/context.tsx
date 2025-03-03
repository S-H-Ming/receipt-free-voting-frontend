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
import { CANDIDATES } from "@/environment";
import { EventsService } from "@tzkt/sdk-events";
import { ContextState, Candidate, EncryptedPairs } from "@/interfaces/context.interface";
import { Voter } from "@/libs/mask_ballot";
import * as nextAuth from "next-auth/react";
import * as backendApis from "@/libs/backend_apis";

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
  const [currentStep, setCurrentStep] =
    useState<ContextState["currentStep"]>("connect_wallet");

  const [candidates, setCandidates] = useState<ContextState["candidates"]>([]);

  /* 
  const handleVote = async (candidate: Candidate) => {
    if (!tezos) {
      console.error("Tezos toolkit is not initialized.");
      alert("Please connect your wallet before voting.");
      return;
    }
    try {
      const contract = await tezos.wallet.at(candidate.address!);
      const op = await contract.methodsObject.vote({
        ballot_sig: 0,
        mask_inv: 0,
        mask: 0,      
        v: 0     
      }).send();
      await op.confirmation();
      setStep("voting_success");
      alert(`Voted successfully! Operation hash : ${op.opHash}`);
    } catch (error) {
      console.error("Error while voting : ", error);
    }
  };
  */

  const handleVote = async () => {
    if (!tezos) {
      console.error("Tezos toolkit is not initialized.");
      alert("Please connect your wallet before voting.");
      return;
    }

    try {
      // filter out candidates w/o address
      const validCandidates = candidates.filter((c) => c.address);
      if (validCandidates.length === 0) {
        alert("No valid candidates to vote for.");
        return;
      }

      // get all contracts from each candidate
      const batchOps: WalletParamsWithKind[] = await Promise.all(
        validCandidates.map(async (candidate) => {
          const contract = await tezos.wallet.at(candidate.address!);
          const transferParams = contract.methodsObject
            .vote({
              ballot_sig: 0,
              mask_inv: 0,
              mask: 0,
              v: 0,
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
      setStep("voting_success");
      alert(`Voted successfully! Batch operation hash: ${res.opHash}`);
    } catch (error) {
      console.error("Error while voting:", error);
      alert("Voting failed. Please try again.");
    }
  };

  const updateVote = (id: number, checked: boolean) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, selected: checked } : candidate
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
    setCandidates(CANDIDATES);
    setIsInitLoading(false);
  }, [initTezosWallet]);

  useEffect(() => {
    if (isInitLoading) {
      init();
    }
  }, [isInitLoading, init]);

  const updateMessage = (message: string) => setMessage(message);

  const setAccount = async () => {
    setAcc(
      tezos !== null ? await wallet?.client.getActiveAccount() : undefined
    );
    setAddress((await wallet?.client.getActiveAccount())?.address);
  };

  const setStep = (step: ContextState["currentStep"]) => {
    setCurrentStep(step);
    switch (step) {
      case "connect_wallet":
        break;
      case "login_google":
        break;
      case "voting":
        backendApis.askEncryptedPairs().then((encPairs) => {
          const rsaN = BigInt("736270112415730588492485421210735645273779098054243591672750439722996117391987353772994557321116405168970421394378385270388976289677265840660669881236428663904701088161411043464615355608344596314149487814072855704116824134466719065062344836512380379120552900282269009588252253758528560327553667024571029749309986291825799437638152555968249769472112108041626007921102217919895090542408361660539112475161793221237455385218014371879343236107054154945944942824137800775238284644174995326741356343321021929378557790996531345288923696645281279044239851801045024499546238813355671025539860099380214443582117591792978060250077860710829025079073922195638057774063671802941371462567309557546983008266168196647624295858223526418594508225503508306000825269784250441863575393575647776819529732283960736897823167197747494461691046777351097224300022842837140970278389408979665810172632949851763215013332197082920215650336332618575272252246165007661027337140304730004448362015184314763207705145194985561062699360290022844309625379244329040655129296361768751233204693815772450442630765793290194287443833794000730301234724413538504337512166566804140320757132425910260595755333903617414791907623666180671752637001829242753079629651224176867663353645907"); 
          const rsaV = BigInt("65537"); 
          const voter = new Voter();
          setCandidates(prevCandidates =>
            prevCandidates.map(candidate => {
                const candidateEncPairs = encPairs[candidate.id];
                if (!candidateEncPairs) {
                  throw new Error(`Mismatch in candidate ID: ${candidate.id}`);
                }
                voter.receiveEncPairs(candidateEncPairs);
                const ballot = voter.generateBallot(rsaN, rsaV);
        
                if (!voter["mask"] || !voter["maskInv"]) {
                    throw new Error(`Mask generation failed for candidate: ${candidate.name}`);
                }
        
                return {
                    ...candidate,
                    mask: voter["mask"] as bigint,
                    mask_inv: voter["maskInv"] as bigint,
                    ballot: [ballot.b1, ballot.b2],
                };
            })
        );
        });
        break;
      case "voting_success":
        break;
      case "tally_pending":
        break;
      case "tally_completed":
        break;  
    }
  };

  // const updateGoogleAccount = (account: string | undefined) => {
  //   setGoogleAccount(account);
  // };

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
      setCurrentStep("login_google");
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
    setCurrentStep("connect_wallet");
  };

  const signInGoogle = async (callbackUrl: string = "") => {
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
        setStep,
        signInGoogle,
        signOutGoogle,
        updateMessage,
        setAccount,
        syncTaquito,
        disconnect,
        handleVote,
        updateVote,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
