import Anthropic from "@anthropic-ai/sdk";
import type { CVProfileData, TailoredCVData, ATSScoreBreakdown } from "../types";

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
};

export async function tailorCVWithClaude(
  cvProfile: CVProfileData,
  jobDescription: string,
  jobTitle: string,
  company: string
): Promise<{ tailoredCV: TailoredCVData; coverLetter: string; atsScore: ATSScoreBreakdown }> {
  const client = getClient();

  const prompt = `You are an expert ATS (Applicant Tracking System) CV optimizer and career consultant.

I need you to analyze a job description and tailor a CV to maximize ATS compatibility and score.

## JOB DETAILS
- **Job Title**: ${jobTitle}
- **Company**: ${company}
- **Job Description**:
${jobDescription}

## CURRENT CV DATA
${JSON.stringify(cvProfile, null, 2)}

## YOUR TASKS

### 1. TAILOR THE CV
- Rewrite the professional summary to align with the JD keywords and requirements
- Reorder and emphasize skills that match the JD (put matching skills first)
- Rephrase experience bullet points to incorporate JD keywords naturally
- Ensure all relevant keywords from the JD appear in the CV
- Keep it truthful - only rephrase/reorganize, don't fabricate experience

### 2. GENERATE A COVER LETTER
- Professional, 3-4 paragraphs
- Address the company and role specifically
- Highlight matching experience and skills
- Include specific JD keywords naturally
- Show enthusiasm and cultural fit
- Keep it under 400 words

### 3. CALCULATE ATS SCORE
Score the tailored CV out of 100 with breakdown:
- keywordMatch (0-100): % of JD keywords found in CV
- formatScore (0-100): ATS-friendly format compliance
- sectionCompleteness (0-100): All important sections present
- actionVerbs (0-100): Use of strong action verbs
- quantifiedAchievements (0-100): Measurable results in bullet points
- overall (0-100): Weighted average
- suggestions: Array of specific improvement tips

Respond with ONLY valid JSON in this exact format:
{
  "tailoredCV": {
    "fullName": "...",
    "email": "...",
    "phone": "...",
    "location": "...",
    "linkedin": "...",
    "portfolio": "...",
    "tailoredSummary": "...",
    "summary": "original summary",
    "tailoredSkills": [{"category": "...", "items": ["..."]}],
    "skills": [{"category": "...", "items": ["..."]}],
    "tailoredExperience": [{"company": "...", "role": "...", "startDate": "...", "endDate": "...", "current": false, "bullets": ["..."]}],
    "experience": [{"company": "...", "role": "...", "startDate": "...", "endDate": "...", "current": false, "bullets": ["..."]}],
    "education": [{"degree": "...", "institution": "...", "startDate": "...", "endDate": "...", "gpa": "..."}],
    "certifications": ["..."],
    "projects": [{"name": "...", "description": "...", "tech": ["..."], "link": "..."}],
    "keywordsMatched": ["keyword1", "keyword2"],
    "keywordsMissing": ["keyword3"]
  },
  "coverLetter": "Full cover letter text here...",
  "atsScore": {
    "keywordMatch": 85,
    "formatScore": 90,
    "sectionCompleteness": 95,
    "actionVerbs": 80,
    "quantifiedAchievements": 75,
    "overall": 85,
    "suggestions": ["suggestion1", "suggestion2"]
  }
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  // Extract JSON from response (handle markdown code blocks)
  let jsonText = content.text.trim();
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonText = jsonMatch[1].trim();

  const result = JSON.parse(jsonText);
  return result;
}

export async function regenerateSection(
  section: string,
  currentContent: string,
  jobDescription: string,
  instructions: string
): Promise<string> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an ATS optimization expert. Regenerate the following ${section} section to better match the job description.

Job Description: ${jobDescription}

Current Content: ${currentContent}

Additional Instructions: ${instructions}

Respond with ONLY the improved content as a JSON string (or JSON array/object matching the input format).`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text.trim();
}
