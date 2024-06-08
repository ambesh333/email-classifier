import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { google } from "googleapis";
import { NEXT_AUTH_CONFIG } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(NEXT_AUTH_CONFIG);

  if (!session || !session.accessToken || !session.refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID!,
    process.env.GOOGLE_SECRET!
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages || [];

    const emailPromises = messages.map(async (message) => {
      if (message.id) {
        const emailResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const email = emailResponse.data;

        // Extract essential information from the email
        const { id, snippet, internalDate, payload } = email;
        const headers = payload?.headers || [];

        // Extract specific headers like From, To, Subject, and Date
        const from = headers.find((header) => header.name === "From")?.value;
        const to = headers.find((header) => header.name === "To")?.value;
        const subject = headers.find(
          (header) => header.name === "Subject"
        )?.value;
        const date = headers.find((header) => header.name === "Date")?.value;

        return {
          id,
          snippet,
          internalDate,
          from,
          to,
          subject,
          date, // Add the date when the email was received
        };
      } else {
        return Promise.reject(new Error("Message ID is missing"));
      }
    });

    const emails = await Promise.all(emailPromises);
    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { message: "Error fetching emails" },
      { status: 500 }
    );
  }
};
