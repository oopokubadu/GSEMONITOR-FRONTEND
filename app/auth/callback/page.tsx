"use client";

import { useEffect } from "react";

export default function Callback() {

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const authToken = urlParams.get("auth_token");
      const userId = urlParams.get("user_id");
      window.location.href = "/dashboard?user_id=" + userId;
  }, []); // Redirect to the dashboard when the component mounts

  return <p>Signing you in...</p>;
}