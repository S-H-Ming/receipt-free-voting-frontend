import { useEffect, useState } from "react";
import axios from "axios";
import { VA_SERVER_URL, IA_SERVER_URL } from "@/environment";
import {
  EncryptedPairs,
  Commitment,
  Ballot,
  Proof,
  ResultResponse,
  RegisterResponse,
  CommitmentReponse,
  AmountResponse
} from "@/interfaces/context.interface";
import { getSession } from "next-auth/react";
import { Candidate } from "../interfaces/apiTypes";

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

export const register = async (ballots: Ballot[]): Promise<Ballot[]> => {
  const session = await getSession();
  if (session?.user?.identifier === undefined) {
    throw new Error("User not logged in");
  }

  try {
    const ballotTuples: [string, string][] = ballots.map((ballot) => [
      ballot[0].toString(),
      ballot[1].toString(),
    ]);
    const response = await axios.post<RegisterResponse>(
      `${IA_SERVER_URL}/IA/register`,
      {
        email: session.user.identifier,
        ballot: ballotTuples,
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 200) {
      const sign_ballots = response.data.sign_ballot;
      return sign_ballots.map((pair) => [BigInt(pair[0]), BigInt(pair[1])]);
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const getCommitment = async (ballot: Ballot, id: number, ep: [bigint, bigint][]): Promise<Commitment> => {

  const ballotTuple: [string, string] = ballot.map(num => num.toString()) as [string, string];
    try {
        const response = await axios.post<CommitmentReponse>(`${VA_SERVER_URL}/VA/get_commitment`, {
            sign_ballot: ballotTuple,
            id: id,
            ep: ep.map(pair => [pair[0].toString(), pair[1].toString()])
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

export const getResults = async (): Promise<ResultResponse> => {
  try {
    const response = await axios.get(`${VA_SERVER_URL}/VA/get_results`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      const data: ResultResponse = Object.fromEntries(
        Object.entries(response.data).map(([key, value]) => {
          const tuple = value as [number, string];
          return [key, [tuple[0], BigInt(tuple[1])]];
        })
      );
      return data;
    }
    throw new Error(`Failed to fetch results, status: ${response.status}`);
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

export const getVoteCount = async (): Promise<AmountResponse> => {
  try {
    const response = await axios.get(`${VA_SERVER_URL}/VA/get_amount`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error(`Failed to fetch results, status: ${response.status}`);
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