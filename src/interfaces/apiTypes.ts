// 定義interfaces
export interface ResultResponse {
    result: "yes" | "no";
}
  
export interface Candidate {
    name: string;
    image_data: string; // Base64 encoded image
}
  
export interface EncryptedResultResponse {
    eresult: number;
}  