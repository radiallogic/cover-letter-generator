// app/api/generate-cover-letter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/app/lib/openai";
import { CV_TEXT } from "@/data/cv";

export const runtime = "nodejs"; // or "edge" if you want, but Node is fine

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, roleTitle, companyName, tone } = await req.json();

    if (!jobDescription || !roleTitle || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // You can tune this prompt however you like
    const instructions = `
You are an expert career coach and CV writer.
Write a tailored cover letter for the role "${roleTitle}" at "${companyName}".

Use the candidate CV and the job description below.
The letter must:
- Be honest and only claim experience that appears in the CV
- Be 2–3 paragraphs
- Use a ${tone || "professional but friendly"} tone
- Emphasise relevant skills, experience and impact
- Mention motivation for the company and role specifically
`;

    const response = await openai.responses.create({
      model: "gpt-5.1",
      instructions,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text: `CANDIDATE CV:\n${CV_TEXT}`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `JOB DESCRIPTION:\n${jobDescription}`,
            },
          ],
        },
      ],
    });


    console.log( response)

    // Helper for Responses API – extracts plain text from output
    const text =
    (response.output && "output_text" in response && response.output_text) ||
      "No output";

    return NextResponse.json({ coverLetter: text });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate cover letter" },
      { status: 500 }
    );
  }
}
