"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function Callback() {
  const {isSignedIn} = useAuth();

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("user_id");
      const authToken = urlParams.get("auth_token");
      localStorage.setItem("authToken", authToken || ""); 
      localStorage.setItem("userId", userId || "");
      localStorage.setItem("googleToken", authToken || ""); // Store the auth token in local storage
      window.location.href = "/dashboard"; // Redirect to the dashboard after setting local storage
  }, []); // Redirect to the dashboard when the component mounts

  return <p>Signing you in...</p>;
}