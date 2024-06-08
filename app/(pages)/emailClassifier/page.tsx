"use client";
import { useEffect, useState } from "react";

interface Email {
  body: string;
  classification?: string;
}

export default function EmailClassifier() {
  const [classifiedEmails, setClassifiedEmails] = useState<Email[]>([]);

  useEffect(() => {
    const fetchClassifiedEmails = async () => {
      try {
        const response = await fetch("/api/classify");
        const data = await response.json();
        setClassifiedEmails(data);
      } catch (error) {
        console.error("Error fetching classified emails:", error);
      }
    };

    fetchClassifiedEmails();
  }, []);

  return (
    <div>
      <h1>Classified Emails</h1>
      {classifiedEmails.map((email, index) => (
        <div key={index}>
          <p>{email.body}</p>
          <p>Classification: {email.classification}</p>
        </div>
      ))}
    </div>
  );
}
