import { EncryptedResultResponse } from "../interfaces/apiTypes";

const API_URL = "https://127.0.0.1:8000";

// Fetch results from the API
export const getEncryptedResult = async (): Promise<EncryptedResultResponse> => {
  try {
    const response = await fetch(`${API_URL}/VA/get_encryptedresult`, {
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
