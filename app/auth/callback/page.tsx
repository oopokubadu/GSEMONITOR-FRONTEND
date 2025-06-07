import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
      localStorage.setItem("authToken", router?.query?.token as string);
      localStorage.setItem("userId", router?.query?.user_id as string);
      router.replace("/dashboard");
  }, [router]);

  return <p>Signing you in...</p>;
}