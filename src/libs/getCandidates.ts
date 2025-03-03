import { Candidate } from '@/interfaces/context.interface';

const API_URL = "https://blockchain-vote.imlab.app/backend";

// Fetch results from the API
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_URL}/get_candidates`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: Candidate = await response.json();

    const candidates: Candidate[] = data.map((candidate: any, index: number) => ({
      id: index + 1,
      name: candidate.name,
      imageURL: `data:image/png;base64,${candidate.image_data}`,
      description: candidate.description,
      checked: false,
    }));

    return candidates;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

