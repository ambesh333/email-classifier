"use client";
import { setItemInStorage } from "@/lib/localStorage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function () {
  const { data: session } = useSession();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
      if (session) {
        try {
          const response = await fetch("/api/email");
          const data = await response.json();
          setEmails(data);
          setItemInStorage("emails", data);
        } catch (error) {
          console.error("Error fetching emails:", error);
        }
      }
    };

    fetchEmails();
  }, [session]);

  return (
    <div>
      <h1>Gmail API Quickstart</h1>
      <pre>{JSON.stringify(emails, null, 2)}</pre>
    </div>
  );
}
