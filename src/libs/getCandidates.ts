import { Candidate } from "../interfaces/apiTypes";

const API_URL = "https://127.0.0.1:8000";

// Fetch results from the API
export const getCandidates = async (): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_URL}/get_candidates`, {
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
