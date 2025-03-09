import {  VA_SERVER_URL } from "@/environment";

// Fetch results from the API
export const setResult = async (data: {
  [key: number]: number;
}): Promise<void> => {
  try {
    const response = await fetch(`${VA_SERVER_URL}/set_result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("setResult successful");
  } catch (error) {
    console.error("Error setting result:", error);
    throw error;
  }
};
