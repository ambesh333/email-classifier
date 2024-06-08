import { NextResponse } from "next/server";
import { classifyAndStoreEmails } from "@/lib/emailClassifier";

export async function GET() {
  try {
    const emails = await classifyAndStoreEmails();
    return NextResponse.json(emails);
  } catch (error) {
    console.error("Error classifying emails:", error);
    return NextResponse.json(
      { error: "Failed to classify emails" },
      { status: 500 }
    );
  }
}
