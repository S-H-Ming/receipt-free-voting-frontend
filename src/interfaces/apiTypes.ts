export interface ResultResponse {
    [key: string]: [number, number];
}
  
export interface Candidate {
    id: number;
    imageURL: string;
    name: string;
    address?: string;
    checked: boolean;
    mask?: bigint;
    mask_inv?: bigint;
    ballot?: [bigint, bigint];
    ballot_sig?: [bigint, bigint];
    description?: string;
}
  
// export interface EncryptedResultResponse {
//     eresult: number;
// }  
