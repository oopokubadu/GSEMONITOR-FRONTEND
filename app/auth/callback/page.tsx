"use client";

import { useEffect } from "react";

export default function Callback() {

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("user_id");
      const authToken = urlParams.get("auth_token");
      localStorage.setItem("authToken", authToken || ""); 
      localStorage.setItem("userId", userId || "");
      window.location.href = "/dashboard"; // Redirect to the dashboard after setting local storage
  }, []); // Redirect to the dashboard when the component mounts

  return <p>Signing you in...</p>;
}