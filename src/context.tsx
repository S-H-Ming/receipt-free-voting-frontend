"use client"

import React, { createContext, useCallback, useEffect, useState } from "react"
import { type BeaconWallet } from "@taquito/beacon-wallet"
import { MichelsonMap, OpKind, WalletParamsWithKind, type TezosToolkit } from "@taquito/taquito"
import { type AccountInfo } from "@airgap/beacon-types"
import { NetworkType } from "@airgap/beacon-types";

// import {
//   NETWORK_TYPE,
//   NODE_URL,
//   TZAPEX_GACHA_ADDR,
//   TZKT_API_URL,
//   APEX_TOKEN_ADDR
// } from "@/enviroment"
import { EventsService } from "@tzkt/sdk-events"
import { ContextState } from "@/interfaces/context.interface"

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

  var cands = [
    { id: 1, name: "test1", imageURL: "../images/test.jpg" },
    { id: 2, name: "test2", imageURL: "../images/test.jpg" },
    { id: 3, name: "test3", imageURL: "../images/test.jpg" },
    { id: 4, name: "test4", imageURL: "../images/test.jpg" },
    { id: 5, name: "test5", imageURL: "../images/test.jpg" },
    { id: 6, name: "test6", imageURL: "../images/test.jpg" },
    { id: 7, name: "test7", imageURL: "../images/test.jpg" },
    { id: 8, name: "test8", imageURL: "../images/test.jpg" },
    { id: 9, name: "test9", imageURL: "../images/test.jpg" },
    { id: 10, name: "test10", imageURL: "../images/test.jpg" },
  ];
  const handleVote = async (id: number) => {
    alert(`Voted for candidate with ID: ${id}`);
  };

  // Use Ghostnet temporarily
  const initTezosWallet = useCallback(async () => {
    if (tezos === null || wallet === null) {
      const _tezos = new (await import("@taquito/taquito")).TezosToolkit("https://ghostnet.ecadinfra.com")
      const _wallet = new (await import("@taquito/beacon-wallet")).BeaconWallet({
        name: "TZAPEX",
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
    setCandidates(cands)
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

  const checkOpStatus = async (tzktEvents: EventsService, opHash: string, contract: string) => {
    console.log("Hash : " + opHash)

    const tx = await new Promise((resolve) => {
      tzktEvents
        .operations({
          types: ["transaction"],
          address: contract
        })
        .subscribe({
          next: (tx: any) => {
            if (tx.data.hash === opHash) {
              resolve(tx)
            }
          }
        })
      setTimeout(() => resolve(null), 60000)
    })

    if (tx === null) {
      return {
        status: "failed",
        opHash: opHash
      }
    } else {
      return {
        status: "success",
        opHash: opHash
      }
    }
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
        handleVote
      }}
    >
  {props.children}
</Context.Provider>

  )
}

  /*
  const createGacha = async (
    tokenList: { fa2: string; id: number; amount: number }[],
    totalRound: number,
    startTime: Date,
    endTime: Date,
    apexPerGacha: number,
    metadataUri: string
  ) => {
    const tz = await wallet?.client.getActiveAccount()

    let tokensMMap = new MichelsonMap()
    let addOperatorsMap = new Map()
    let removeOperatorsMap = new Map()
    let batchOps: WalletParamsWithKind[] = []

    for (let i = 0; i < tokenList.length; i++) {
      const tokenData = tokenList[i]
      // set gacha items michelson map
      tokensMMap.set(
        {
          fa2: tokenData.fa2,
          id: tokenData.id
        },
        tokenData.amount
      )
      // set on/off the tokens' update_operator parameters for akaDrop
      if (!addOperatorsMap.has(tokenData.fa2)) {
        addOperatorsMap.set(tokenData.fa2, [])
        removeOperatorsMap.set(tokenData.fa2, [])
      }
      addOperatorsMap.get(tokenData.fa2).push({
        add_operator: {
          operator: TZAPEX_GACHA_ADDR,
          token_id: tokenData.id,
          owner: tz!.address
        }
      })
      removeOperatorsMap.get(tokenData.fa2).push({
        remove_operator: {
          operator: TZAPEX_GACHA_ADDR,
          token_id: tokenData.id,
          owner: tz!.address
        }
      })
    }
    // BATCH OP 1: add operators
    for (const [key, value] of addOperatorsMap.entries()) {
      const c_fa2 = await tezos?.wallet.at(key!)
      const c_updateOperators = c_fa2!.methodsObject.update_operators(value).toTransferParams()
      batchOps.push({
        kind: OpKind.TRANSACTION,
        ...c_updateOperators
      })
    }

    // BATCH OP 2: make gacha at tzapex gacha
    const c_apexGacha = await tezos?.wallet.at(TZAPEX_GACHA_ADDR)
    const c_makeGacha = c_apexGacha!.methodsObject
      .make_gacha({
        apex_per_gacha: apexPerGacha,
        start_time: startTime,
        end_time: endTime,
        metadata: metadataUri,
        tokens: tokensMMap,
        total_round: totalRound
      })
      .toTransferParams()
    batchOps.push({
      kind: OpKind.TRANSACTION,
      ...c_makeGacha
    })

    // BATCH OP 3: remove operators
    for (const [key, value] of removeOperatorsMap.entries()) {
      const c_fa2 = await tezos?.wallet.at(key!)
      const c_updateOperators = c_fa2!.methodsObject.update_operators(value).toTransferParams()
      batchOps.push({
        kind: OpKind.TRANSACTION,
        ...c_updateOperators
      })
    }

    // subscribe on tzkt events
    const tzktEvents = new EventsService({
      url: `${TZKT_API_URL}/v1/ws`,
      reconnect: true
    })
    await tzktEvents.start()

    const res: { status: string; opHash: string } = await tezos!.wallet
      .batch(batchOps)
      .send()
      .then(async (op) => {
        return checkOpStatus(tzktEvents, op.opHash, TZAPEX_GACHA_ADDR)
      })
      .catch((_) => ({ status: "error", opHash: "" }))

    // end subscribing on tzkt events
    await tzktEvents.stop()

    return res
  }

  const playGacha = async (gachaId: number) => {
    const tz = await wallet?.client.getActiveAccount()

    // BATCH OP 1: add operators on apex token
    const c_apex_fa2 = await tezos?.wallet.at(APEX_TOKEN_ADDR)
    const c_addOperators = c_apex_fa2!.methodsObject
      .update_operators([
        {
          add_operator: {
            operator: TZAPEX_GACHA_ADDR,
            token_id: 0,
            owner: tz!.address
          }
        }
      ])
      .toTransferParams()

    // BATCH OP 2: play gacha
    const c_apexGacha = await tezos?.wallet.at(TZAPEX_GACHA_ADDR)
    const c_playGacha = c_apexGacha!.methodsObject
      .play_gacha(gachaId)
      .toTransferParams({ storageLimit: 1e3 })

    // BATCH OP 3: remove operators on apex token
    const c_removeOperators = c_apex_fa2!.methodsObject
      .update_operators([
        {
          remove_operator: {
            operator: TZAPEX_GACHA_ADDR,
            token_id: 0,
            owner: tz!.address
          }
        }
      ])
      .toTransferParams()

    const batchOps: WalletParamsWithKind[] = [
      {
        kind: OpKind.TRANSACTION,
        ...c_addOperators
      },
      {
        kind: OpKind.TRANSACTION,
        ...c_playGacha
      },
      {
        kind: OpKind.TRANSACTION,
        ...c_removeOperators
      }
    ]

    // subscribe on tzkt events
    const tzktEvents = new EventsService({
      url: `${TZKT_API_URL}/v1/ws`,
      reconnect: true
    })
    await tzktEvents.start()

    const res: { status: string; opHash: string } = await tezos!.wallet
      .batch(batchOps)
      .send()
      .then(async (op) => {
        return checkOpStatus(tzktEvents, op.opHash, TZAPEX_GACHA_ADDR)
      })
      .catch((_) => ({ status: "error", opHash: "" }))

    // end subscribing on tzkt events
    await tzktEvents.stop()

    return res
  }
  */