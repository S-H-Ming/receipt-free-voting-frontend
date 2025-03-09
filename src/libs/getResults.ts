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
