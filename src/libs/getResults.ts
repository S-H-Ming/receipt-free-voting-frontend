import { TZKT_API_URL } from "@/constants";
import { ResultResponse } from "../interfaces/apiTypes";
import { VA_SERVER_URL } from "@/environment";

// Fetch results from the API
export const getResults = async (): Promise<ResultResponse> => {
  try {
    const response = await fetch(`${VA_SERVER_URL}/get_results`, {
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

export const getAmount = async ({
  address,
}: {
  address: string;
}): Promise<number> => {
  try {
    const response = await fetch(
      `${TZKT_API_URL}/contracts/${address}/storage`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.vote_count;
  } catch (error) {
    console.error("Error fetching amount:", error);
    throw error;
  }
};
