import { getItemFromStorage } from "@/lib/localStorage";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Email {
  body: string;
}

const classifyEmail = async (email: Email): Promise<string> => {
  const prompt = `Classify the following email into one of the following categories:

Important: Emails that are personal or work-related and require immediate attention.
Promotions: Emails related to sales, discounts, and marketing campaigns.
Social: Emails from social networks, friends, and family.
Marketing: Emails related to marketing, newsletters, and notifications.
Spam: Unwanted or unsolicited emails.
General: If none of the above are matched, use General.

Email: ${email.body}`;

  try {
    const response = await openai.completions.create({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100, // Adjusted based on the new API
    });

    const classification = response.choices[0].text.trim();
    return classification;
  } catch (error) {
    console.error("Error classifying email:", error);
    return "General";
  }
};

export const classifyAndStoreEmails = async (): Promise<
  (Email & { classification: string })[]
> => {
  const emails: Email[] = (await getItemFromStorage("emails")) || [];
  console.log(emails);

  const classifiedEmails = await Promise.all(
    emails.map(async (email) => {
      const classification = await classifyEmail(email);
      return { ...email, classification };
    })
  );

  return classifiedEmails;
};
