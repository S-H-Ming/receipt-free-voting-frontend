import { AccountInfo } from "@airgap/beacon-types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";

export enum VotingStep {
  CONNECT_WALLET = "connect_wallet",
  LOGIN_GOOGLE = "login_google",
  VOTING = "voting",
  VOTING_SUCCESS = "voting_success",
  TALLY_PENDING = "tally_pending",
  TALLY_COMPLETED = "tally_completed",
}

export interface Candidate {
  id: number;
  imageURL: string;
  name: string;
  address?: string;
  checked: boolean;
  mask?: bigint;
  mask_inv?: bigint;
  ballot: [bigint, bigint];
  enc_pairs: [bigint, bigint][];
  amount?: number;
  // ia_ballot_sig?: [bigint, bigint];
  // va_ballot_sig?: [bigint, bigint];
  // commitment_bit?: boolean;
}

export interface CommitmentReponse {
  commitment: number[];
  ballot_signature: [bigint, bigint];
}

export interface Commitment {
  commitment: boolean;
  ballot_signature: [bigint, bigint];
}

export interface Proof {
  [key: string]: [[[bigint, bigint], [bigint, bigint]]][];
}

export interface EncryptedPairs {
  [key: string]: [bigint, bigint][];
}

export interface ResultResponse {
  [key: string]: [number, bigint];
}

export interface AmountResponse {
  [key: number]: number;
}

// export interface Ballot {
//   b1: bigint;
//   b2: bigint;
// }

export type Ballot = [bigint, bigint];

export interface register_voter {
  email: string;
  ballot: Ballot;
}

export interface RegisterResponse {
  sign_ballot: [string, string][];
}

export interface ContextState {
  isInitLoading: boolean;
  gateways: { [key: string]: string };
  tezos: TezosToolkit | null;
  wallet: BeaconWallet | null;
  acc?: AccountInfo;
  address?: string;
  message: string;
  currentStep: VotingStep;
  candidates: Candidate[];
  gmail: string | undefined;
  isAdmin: boolean;
  setStep: (step: ContextState["currentStep"]) => void;
  signInGoogle: (callbackUrl?: string) => Promise<boolean>;
  signOutGoogle: () => Promise<void>;
  updateMessage: (message: string) => void;
  setAccount: () => Promise<void>;
  initCandidates: () => Promise<void>;
  syncTaquito: () => Promise<void>;
  disconnect: () => Promise<void>;
  handleVote: () => Promise<void>;
  updateVote: (id: number, checked: boolean) => void;
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
