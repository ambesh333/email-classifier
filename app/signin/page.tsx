"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={async () => {
          await signIn("google");
          router.push("/");
        }}
      >
        Login with google
      </button>

      <br />
    </div>
  );
}
