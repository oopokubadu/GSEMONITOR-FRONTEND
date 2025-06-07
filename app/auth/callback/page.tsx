"use client";

import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    const authToken = urlParams.get("access_token");

    if (userId && authToken) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userId", userId);

      // Ensure localStorage is set before redirecting
      setTimeout(() => {
        window.location.href = `/`;
      }, 100); // Small delay to allow storage update
    }
  }, []);

  return <p></p>;
}