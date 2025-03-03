import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/environment';
import { EncryptedPairs, Commitment, Ballot, Proof, ResultResponse, EncryptedResultResponse, RegisterResponse } from '@/interfaces/context.interface';
import { useSession } from 'next-auth/react';

// === 乙馨 ===

export const askEncryptedPairs = async (): Promise<EncryptedPairs> => {
    try {
        console.log(`Fetching encrypted pairs from ${BACKEND_URL}/VA/get_pairs`);
        const response = await axios.get(`${BACKEND_URL}/VA/get_pairs`);
        if (response.status === 200) {
            const formattedData: EncryptedPairs = Object.fromEntries(
                Object.entries(response.data).map(([key, value]) => [
                    parseInt(key),
                    (value as [number, number][]).map(pair => [BigInt(pair[0]), BigInt(pair[1])])
                ])
            );
            return formattedData;
        }
        throw new Error(`Failed to fetch encrypted pairs, status: ${response.status}`);
    } catch (error) {
        console.error("Error fetching encrypted pairs:", error);
        throw error;
    }
};


export const register = async (ballot: Ballot): Promise<Ballot> => {
    const { data: session } = useSession();

    if (!session?.user?.identifier) {
        throw new Error("User not authenticated");
    }

    try {
        const ballotTuple: [bigint, bigint] = [ballot.b1, ballot.b2];
        const response = await axios.post<RegisterResponse>(`${BACKEND_URL}/ia/register`, {
            email: session.user.identifier,
            ballot: ballotTuple, 
        });

        if (response.status === 200) {
            const [b1, b2] = response.data.sign_ballot;
            return {b1: BigInt(b1), b2: BigInt(b2) };
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

// === 子芹 ===

  export const getCommitment = async (): Promise<Commitment> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/VA/get_commitment`);
        if (response.status === 200) {
            return response.data;
        }
        throw new Error(`Failed to fetch commitment, status: ${response.status}`);
    } catch (error) {
        console.error('Error fetching commitment:', error);
        throw error;
    }
};

export const getProof = async (): Promise<Proof> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/VA/get_proof`);
        if (response.status === 200) {
            return response.data; 
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

export const getEncryptedResult = async (): Promise<EncryptedResultResponse> => {
    try {
      const response = await fetch(`${BACKEND_URL}/VA/get_encryptedresult`, {
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
    const response = await fetch(`${BACKEND_URL}/VA/get_results`, {
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