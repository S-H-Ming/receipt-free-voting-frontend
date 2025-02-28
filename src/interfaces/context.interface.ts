import { AccountInfo } from "@airgap/beacon-types"
import { BeaconWallet } from "@taquito/beacon-wallet"
import { TezosToolkit } from "@taquito/taquito"

export interface commitment {
  commitment: string;
  seed: number;
  proof: [[number, number], [number, number]] [];
}

export interface proof {
  seed: number;
  proof: [[number, number], [number, number]] [];
}

export interface encrypted_pairs {
  encrypted_pairs: [[number, number], [number, number]] [];
}

export interface Ballot {
  mask: string;
  mask_inv: string;
}

export interface register_voter {
  email: string;
  ballot: Ballot;
}

export interface register_response {
  sign_ballot: [number, number];
}

export interface ContextState {
  isInitLoading: boolean
  gateways: { [key: string]: string }
  tezos: TezosToolkit | null
  wallet: BeaconWallet | null
  acc?: AccountInfo
  address?: string
  message: string
  updateMessage: (message: string) => void
  setAccount: () => Promise<void>
  syncTaquito: () => Promise<void>
  disconnect: () => Promise<void>
  /**
   *
   * @param tokenList Gacha token list in a round. Each token will be an object consisting of fa2, id and amount.
   * @param totalRound The total number of times the token list will run
   * @param startTime Gacha's start time
   * @param endTime Gacha's end time
   * @param apexPerGacha The amount of apex needed for each draw of gacha (note that the decimal of apex is 1).
   * @param metadataUri Gacha's metadata URI (ipfs)
   * @returns status: success/failed/error means "transaction success on chain"/"transaction failed on chain"/"error occured when sending transaction"
   */
  // createGacha: (
  //   tokenList: { fa2: string; id: number; amount: number }[],
  //   totalRound: number,
  //   startTime: Date,
  //   endTime: Date,
  //   apexPerGacha: number,
  //   metadataUri: string
  // ) => Promise<{ status: string; opHash: string }>
  // /**
  //  *
  //  * @param gachaId The gacha ID player going to play
  //  * @returns status: success/failed/error means "transaction success on chain"/"transaction failed on chain"/"error occured when sending transaction"
  //  */
  // playGacha: (gachaId: number) => Promise<{ status: string; opHash: string }>
}
