import { ResultResponse } from "../interfaces/apiTypes";
import { API_URL } from "../constants";

// Fetch results from the API
export const getResults = async (): Promise<ResultResponse> => {
  try {
    const response = await fetch(`${API_URL}/VA/get_results`, {
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
