"use client"

import React, { createContext, useCallback, useEffect, useState } from "react"
import { type BeaconWallet } from "@taquito/beacon-wallet"
import { MichelsonMap, OpKind, WalletParamsWithKind, type TezosToolkit } from "@taquito/taquito"
import { type AccountInfo } from "@airgap/beacon-types"
import { NetworkType } from "@airgap/beacon-types";
import {
  CANDIDATES
} from "@/environment"
import { EventsService } from "@tzkt/sdk-events"
import { ContextState, Candidate } from "@/interfaces/context.interface"

export const Context = createContext<ContextState>(null!)
export const ContextProvider = (props: any) => {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(true)
  const [gateways, setGateways] = useState<{ [key: string]: string } | null>(null)
  const [tezos, setTezos] = useState<TezosToolkit | null>(null)
  const [wallet, setWallet] = useState<BeaconWallet | null>(null)
  const [acc, setAcc] = useState<AccountInfo | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState("")
  const [currentStep, setCurrentStep] = useState<ContextState["currentStep"]>("connect_wallet");
  const [googleAccount, setGoogleAccount] = useState<string | undefined>(undefined);
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
      const validCandidates = candidates.filter(c => c.address);
      if (validCandidates.length === 0) {
        alert("No valid candidates to vote for.");
        return;
      }

      // get all contracts from each candidate
      const batchOps : WalletParamsWithKind[] = await Promise.all(
        validCandidates.map(async (candidate) => {
          const contract = await tezos.wallet.at(candidate.address!);
          const transferParams = contract.methodsObject.vote({
            ballot_sig: 0,
            mask_inv: 0,
            mask: 0,
            v: 0
          }).toTransferParams();
  
          return {
            kind: OpKind.TRANSACTION,
            ...transferParams
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
      const _tezos = new (await import("@taquito/taquito")).TezosToolkit("https://ghostnet.ecadinfra.com")
      const _wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet({
        name: "VOTING_APP",
        network: { 
            type: NetworkType.GHOSTNET, // 
            rpcUrl: "https://ghostnet.ecadinfra.com", },
        featuredWallets: ["temple", "kukai", "metamask", "tzsafe"]
      })

      _tezos?.setWalletProvider(_wallet)
      setWallet(_wallet)
      setTezos(_tezos)
    }
  }, [tezos, wallet])

  const init = useCallback(async () => {
    await initTezosWallet()
    setCandidates(CANDIDATES)
    setIsInitLoading(false)
  }, [initTezosWallet])

  useEffect(() => {
    if (isInitLoading) {
      init()
    }
  }, [isInitLoading, init])

  const updateMessage = (message: string) => setMessage(message)

  const setAccount = async () => {
    setAcc(tezos !== null ? await wallet?.client.getActiveAccount() : undefined)
    setAddress((await wallet?.client.getActiveAccount())?.address)
  }

  const setStep = (step: ContextState["currentStep"]) => {
    setCurrentStep(step);
  };

  const updateGoogleAccount = (account: string | undefined) => {
    setGoogleAccount(account);
  };

  const syncTaquito = async () => {
    // We check the storage and only do a permission request if we don't have an active account yet
    // This piece of code should be called on startup to "load" the current address from the user
    // If the activeAccount is present, no "permission request" is required again, unless the user "disconnects" first.
    await initTezosWallet()
    let activeAccount = await wallet!.client.getActiveAccount()
    if (activeAccount === undefined) {
      await wallet!.clearActiveAccount()
      await wallet!
        .requestPermissions()
        .then((response) => {
          console.log(response)
        })
        .catch((e) => console.error(e))
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
  }

  const disconnect = async () => {
    console.log("disconnect wallet")
    // This will clear the active account and the next "syncTaquito" will trigger a new sync
    await wallet!.client.clearActiveAccount()
    setAddress(undefined)
    setAcc(undefined)
    setCurrentStep("connect_wallet")
  }

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
        googleAccount,
        candidates,
        setStep,
        setGoogleAccount: updateGoogleAccount,
        updateMessage,
        setAccount,
        syncTaquito,
        disconnect,
        handleVote,
        updateVote
      }}
    >
  {props.children}
</Context.Provider>

  )
}