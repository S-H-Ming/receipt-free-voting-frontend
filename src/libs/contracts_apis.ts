import { TZKT_API_URL } from "@/constants";

export const getTotalAmount = async ({
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
