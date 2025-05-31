import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useSendPriceAlert() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor.vercel.app";

  return useMutation({
    mutationFn: async ({ ticker, price }: { ticker: string; price: number }) => {
      const user_id = localStorage.getItem("userId"); // Retrieve user ID from local storage

      if (!user_id) {
        throw new Error("User ID not found in local storage.");
      }

      const response = await axios.post(`${url}/price_alert`, {
        user_id,
        ticker,
        price,
      });

      return response.data;
    },
    onSuccess: (data) => {
      console.log("Price alert set successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to set price alert:", error);
    },
  });
}
