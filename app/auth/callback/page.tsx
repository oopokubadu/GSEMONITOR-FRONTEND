"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetProfile } from "@/hooks/use-get-profile"

export default function Callback() {
  const router = useRouter();
  const { data: profile } = useGetProfile();
  const {isSignedIn} = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get("user_id");
    const access_token = urlParams.get("access_token");

    if (user_id) {
      const id = user_id ?? "";
      const token = access_token ?? "";
      
      if(profile?.full_name) {
        localStorage.setItem("userId", id);
        localStorage.setItem("authToken", token);
        router.replace("/dashboard");
      }
    } else {
        // If user_id is not present, redirect to login page
        router.replace("/?login=true");
    }
  }, [router, profile]);

  return <p>Signing you in...</p>;
}