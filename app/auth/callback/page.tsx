"use client";

import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    const authToken = urlParams.get("auth_token");

    console.log("Callback component mounted", authToken, userId);

    if (userId && authToken) {
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("userId", userId);

      // Ensure localStorage is set before redirecting
      setTimeout(() => {
        window.location.href = `/?userId=${userId}&authtoken=${authToken}`;
      }, 100); // Small delay to allow storage update
    }
  }, []);

  return <p></p>;
}