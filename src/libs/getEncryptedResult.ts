import { API_URL } from "@/constants";
import { EncryptedResultResponse } from "../interfaces/apiTypes";

// Fetch results from the API
export const getEncryptedResult =
  async (): Promise<EncryptedResultResponse> => {
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
