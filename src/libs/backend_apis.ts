import { useEffect, useState } from "react";
import axios from "axios";
import { VA_SERVER_URL, IA_SERVER_URL } from "@/environment";
import {
  EncryptedPairs,
  Commitment,
  Ballot,
  Proof,
  ResultResponse,
  EncryptedResultResponse,
  RegisterResponse,
  CommitmentReponse,
} from "@/interfaces/context.interface";
import { getSession } from "next-auth/react";
import { Candidate } from "../interfaces/apiTypes";
// === 乙馨 ===

export const askEncryptedPairs = async (): Promise<EncryptedPairs> => {
  try {
    console.log(`Fetching encrypted pairs from ${VA_SERVER_URL}/VA/get_pairs`);
    const response = await axios.get(`${VA_SERVER_URL}/VA/get_pairs`);
    if (response.status === 200) {
      const formattedData: EncryptedPairs = Object.fromEntries(
        Object.entries(response.data).map(([key, value]) => [
          parseInt(key),
          (value as [string, string][]).map((pair) => [
            BigInt(pair[0]),
            BigInt(pair[1]),
          ]),
        ])
      );
      return formattedData;
    }
    throw new Error(
      `Failed to fetch encrypted pairs, status: ${response.status}`
    );
  } catch (error) {
    console.error("Error fetching encrypted pairs:", error);
    throw error;
  }
};

export const register = async (ballot: Ballot): Promise<Ballot> => {
  const session = await getSession();
  if (session?.user?.identifier === undefined) {
    throw new Error("User not logged in");
  }

  try {
    const ballotTuple: [string, string] = [ballot.b1.toString(), ballot.b2.toString()];
    // console.log("Registering with ballot:", ballotTuple);
    const response = await axios.post<RegisterResponse>(
      `${IA_SERVER_URL}/IA/register`,
      {
        email: session.user.identifier,
        ballot: ballotTuple,
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 200) {
      const [b1, b2] = response.data.sign_ballot;
      return { b1: BigInt(b1), b2: BigInt(b2) };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// === 子芹 ===

export const getCommitment = async (ballot: Ballot, id: number): Promise<Commitment> => {

  const ballotTuple: [string, string] = [ballot.b1.toString(), ballot.b2.toString()];
    try {
        const response = await axios.post<CommitmentReponse>(`${VA_SERVER_URL}/VA/get_commitment`, {
            sign_ballot: ballotTuple,
            id: id
        });
        
        if (response.status === 200) {
          const [b1, b2] = response.data.ballot_signature;
          const commit_bit = !!response.data.commitment[0];
          return { ballot_signature: [BigInt(b1),BigInt(b2)], commitment: commit_bit };
        }
        throw new Error(`Failed to fetch commitment, status: ${response.status}`);
    } catch (error) {
        console.error('Error fetching commitment:', error);
        throw error;
    }
};

export const getProof = async (): Promise<Proof> => {
    try {
        const response = await axios.get(`${VA_SERVER_URL}/VA/get_proof`);
        
        if (response.status === 200) {
            const formattedData: Proof = Object.fromEntries(
                Object.entries(response.data).map(([key, value]) => [
                    key,
                    (value as any[][]).map((tuple) => [[
                        [BigInt(tuple[0][0]), BigInt(tuple[0][1])],
                        [BigInt(tuple[1][0]), BigInt(tuple[1][1])]
                    ]])
                ])
            );
            return formattedData;
        }
        throw new Error(`Failed to fetch proof, status: ${response.status}`);
    } catch (error) {
        console.error('Error fetching proof:', error);
        throw error;
    }
};

/* ==== 凱琪 ===
1. getCandidate 還沒加到這個檔案，在 context.interface.ts 已經有定義好的 Candidate 了，不用在自己開一個 interface，但 candidate 不急可以先暫緩
2. 可以去 environment.ts 看一下目前五個 candidate 的定義。
3. 我把所有 interface 都移動到 context.interface.ts 了
*/

export const getEncryptedResult =
  async (): Promise<EncryptedResultResponse> => {
    try {
      const response = await fetch(`${VA_SERVER_URL}/VA/get_encryptedresult`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: EncryptedResultResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching encrypted result:", error);
      throw error;
    }
  };

export const getResults = async (): Promise<ResultResponse> => {
  try {
    const response = await fetch(`${VA_SERVER_URL}/VA/get_results`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ResultResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${VA_SERVER_URL}/get_candidates`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: Candidate[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};
