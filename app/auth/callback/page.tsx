"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useGetProfile } from "@/hooks/use-get-profile"

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: profile } = useGetProfile();
  const {isSignedIn} = useAuth()

  useEffect(() => {
    const user_id = searchParams.get("user_id");
    const access_token = searchParams.get("access_token");

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
  }, [router, profile, searchParams]);

  return <p>Signing you in...</p>;
}