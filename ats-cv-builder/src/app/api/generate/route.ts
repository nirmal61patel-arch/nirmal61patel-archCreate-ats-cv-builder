import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";
import { tailorCVWithClaude } from "@/lib/ai/claude";
import { calculateATSScore } from "@/lib/ats-scorer";
import type { CVProfileData } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { cvProfileId, jobTitle, company, jobDescription, jobUrl } = await request.json();

    if (!cvProfileId || !jobTitle || !jobDescription) {
      return Response.json({ error: "CV profile, job title, and job description are required" }, { status: 400 });
    }

    // Get CV profile
    const profile = await prisma.cVProfile.findUnique({
      where: { id: cvProfileId, userId: user.id },
    });

    if (!profile) {
      return Response.json({ error: "CV profile not found" }, { status: 404 });
    }

    const cvData: CVProfileData = {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone || "",
      location: profile.location || "",
      linkedin: profile.linkedin || "",
      portfolio: profile.portfolio || "",
      summary: profile.summary || "",
      skills: JSON.parse(profile.skills),
      experience: JSON.parse(profile.experience),
      education: JSON.parse(profile.education),
      certifications: JSON.parse(profile.certifications),
      projects: JSON.parse(profile.projects),
    };

    let result;

    // Try Claude API first
    if (process.env.ANTHROPIC_API_KEY) {
      result = await tailorCVWithClaude(cvData, jobDescription, jobTitle, company);
    } else {
      // Fallback: use local ATS scorer with original CV
      const atsScore = calculateATSScore(cvData, jobDescription);
      result = {
        tailoredCV: {
          ...cvData,
          tailoredSummary: cvData.summary,
          tailoredSkills: cvData.skills,
          tailoredExperience: cvData.experience,
          keywordsMatched: [],
          keywordsMissing: [],
        },
        coverLetter: generateBasicCoverLetter(cvData, jobTitle, company),
        atsScore,
      };
    }

    // Save to database
    const generated = await prisma.generatedCV.create({
      data: {
        userId: user.id,
        cvProfileId,
        jobTitle,
        company: company || "",
        jobDescription,
        jobUrl: jobUrl || "",
        tailoredCV: JSON.stringify(result.tailoredCV),
        coverLetter: result.coverLetter,
        atsScore: result.atsScore.overall,
        atsBreakdown: JSON.stringify(result.atsScore),
      },
    });

    return Response.json({
      id: generated.id,
      tailoredCV: result.tailoredCV,
      coverLetter: result.coverLetter,
      atsScore: result.atsScore,
      jobUrl,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return Response.json({ error: "Failed to generate tailored CV" }, { status: 500 });
  }
}

function generateBasicCoverLetter(cv: CVProfileData, jobTitle: string, company: string): string {
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in ${cv.skills.map(s => s.category).join(", ")}, I am confident in my ability to contribute meaningfully to your team.

${cv.summary || "I am a dedicated professional with a proven track record of delivering results."}

Throughout my career${cv.experience.length > 0 ? `, including my role as ${cv.experience[0].role} at ${cv.experience[0].company}` : ""}, I have developed strong expertise that aligns well with the requirements of this position. I am passionate about leveraging my skills to drive impactful results.

I would welcome the opportunity to discuss how my experience and skills can benefit ${company}. Thank you for considering my application.

Sincerely,
${cv.fullName}`;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const generated = await prisma.generatedCV.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { cvProfile: true },
  });

  return Response.json({
    history: generated.map((g) => ({
      ...g,
      tailoredCV: JSON.parse(g.tailoredCV),
      atsBreakdown: JSON.parse(g.atsBreakdown),
    })),
  });
}
