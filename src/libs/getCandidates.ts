import { Candidate } from "../interfaces/apiTypes";
import { BACKEND_URL } from "@/environment";

// Fetch results from the API
export const getCandidates = async (): Promise<Candidate> => {
  try {
    const response = await fetch(`${BACKEND_URL}/get_candidates`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: Candidate = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};
