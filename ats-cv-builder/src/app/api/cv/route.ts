import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const profiles = await prisma.cVProfile.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({
    profiles: profiles.map((p) => ({
      ...p,
      skills: JSON.parse(p.skills),
      experience: JSON.parse(p.experience),
      education: JSON.parse(p.education),
      certifications: JSON.parse(p.certifications),
      projects: JSON.parse(p.projects),
    })),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();

  const profile = await prisma.cVProfile.create({
    data: {
      userId: user.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin || "",
      portfolio: data.portfolio || "",
      summary: data.summary || "",
      skills: JSON.stringify(data.skills || []),
      experience: JSON.stringify(data.experience || []),
      education: JSON.stringify(data.education || []),
      certifications: JSON.stringify(data.certifications || []),
      projects: JSON.stringify(data.projects || []),
      isDefault: true,
    },
  });

  return Response.json({ profile: { ...profile, skills: data.skills, experience: data.experience, education: data.education, certifications: data.certifications, projects: data.projects } }, { status: 201 });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  if (!data.id) return Response.json({ error: "Profile ID required" }, { status: 400 });

  const profile = await prisma.cVProfile.update({
    where: { id: data.id, userId: user.id },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin || "",
      portfolio: data.portfolio || "",
      summary: data.summary || "",
      skills: JSON.stringify(data.skills || []),
      experience: JSON.stringify(data.experience || []),
      education: JSON.stringify(data.education || []),
      certifications: JSON.stringify(data.certifications || []),
      projects: JSON.stringify(data.projects || []),
    },
  });

  return Response.json({ profile });
}
