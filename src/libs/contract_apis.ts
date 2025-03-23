import { TZKT_API_URL } from "@/constants";
import { InitParams } from "@/interfaces/context.interface";
import {
  OpKind,
  WalletParamsWithKind,
  type TezosToolkit,
} from "@taquito/taquito";
import { useContext } from "react";
import { Context } from "@/context";
import { InitParamsList } from "@/environment";

export const getTotalAmount = async ({
  address,
}: {
  address: string;
}): Promise<number> => {
  try {
    const response = await fetch(
      `${TZKT_API_URL}/contracts/${address}/storage`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.vote_count;
  } catch (error) {
    console.error("Error fetching amount:", error);
    throw error;
  }
};

export const initAllCandidates = async (tezos: TezosToolkit) => {
  // TODO : Temporarily force all candidates params in environment.ts
  const init_params_list = InitParamsList;
  try {
    if (!tezos) throw new Error("Please connect your wallet first.");
    const batchOps: WalletParamsWithKind[] = await Promise.all(
      init_params_list.map( async init_params => {
      const contract = await tezos.wallet.at(init_params.address);
      const formattedInitParams = {
        rsa_key: {
          n: init_params.rsa_n,
          v: init_params.rsa_v
        },
        va_key: {
          n: init_params.va_n,
          v: init_params.va_v
        },
        y: init_params.y,
        n: init_params.n,
        r: init_params.r
      }
      const transferParams = contract.methodsObject
        .init(formattedInitParams)
        .toTransferParams();
      return {
        kind: OpKind.TRANSACTION,
        ...transferParams,
      };
  }));
    const res = await tezos.wallet.batch(batchOps).send();
    await res.confirmation();
  } catch (error) {
    console.error("Error fetching amount:", error);
    throw error;
  }
};