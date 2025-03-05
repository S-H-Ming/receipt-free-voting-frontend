// 定義interfaces
export interface ResultResponse {
  result: "yes" | "no";
}

export interface Candidate {
  names: string;
  img: string; // Base64 encoded image
  description: string;
  id: number;
  address: string;
}

export interface EncryptedResultResponse {
  eresult: number;
}
