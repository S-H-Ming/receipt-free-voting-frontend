import { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/environment';
import { encrypted_pairs, commitment, Ballot } from '@/interfaces/context.interface';
import { EncryptedResultResponse } from "../interfaces/apiTypes";
import { useSession } from 'next-auth/react';

export const askEncryptedPairs = async (): Promise<encrypted_pairs> => {
    try {
        const response = await axios.get(`${BACKEND_URL}/VA/get_pairs`);
        if (response.status === 200) {
            return response.data.map((pair: [number, number]) => [
                BigInt(pair[0]),
                BigInt(pair[1])
            ]);
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
        const response = await axios.post<Ballot>(`${BACKEND_URL}/ia/`, {
            email: session.user.identifier,
            ballot: ballot,
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error("Registration error:", error);
        throw error; 
    }
}


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

  export const getCommitment = async (): Promise<commitment> => {
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