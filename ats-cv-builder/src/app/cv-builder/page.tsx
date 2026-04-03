"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import type { CVProfileData, SkillCategory, Experience, Education, Project } from "@/lib/types";

const STEPS = ["Personal Info", "Summary", "Skills", "Experience", "Education", "Projects & Certs"];

const EMPTY_PROFILE: CVProfileData = {
  fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "",
  summary: "",
  skills: [{ category: "Technical", items: [] }],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
};

export default function CVBuilderPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CVProfileData>(EMPTY_PROFILE);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/cv")
      .then((r) => r.json())
      .then((data) => {
        if (data.profiles?.length > 0) {
          const p = data.profiles[0];
          setProfileId(p.id);
          setProfile({
            fullName: p.fullName, email: p.email, phone: p.phone || "",
            location: p.location || "", linkedin: p.linkedin || "", portfolio: p.portfolio || "",
            summary: p.summary || "",
            skills: p.skills?.length > 0 ? p.skills : [{ category: "Technical", items: [] }],
            experience: p.experience || [],
            education: p.education || [],
            certifications: p.certifications || [],
            projects: p.projects || [],
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    setSaved(false);
    const method = profileId ? "PUT" : "POST";
    const body = profileId ? { ...profile, id: profileId } : profile;

    const res = await fetch("/api/cv", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      if (!profileId) setProfileId(data.profile.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const update = (field: keyof CVProfileData, value: CVProfileData[keyof CVProfileData]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Skills helpers
  const addSkillCategory = () => {
    update("skills", [...profile.skills, { category: "", items: [] }]);
  };
  const updateSkillCategory = (index: number, field: keyof SkillCategory, value: string | string[]) => {
    const updated = [...profile.skills];
    updated[index] = { ...updated[index], [field]: value };
    update("skills", updated);
  };
  const removeSkillCategory = (index: number) => {
    update("skills", profile.skills.filter((_, i) => i !== index));
  };

  // Experience helpers
  const addExperience = () => {
    update("experience", [...profile.experience, { company: "", role: "", startDate: "", endDate: "", current: false, bullets: [""] }]);
  };
  const updateExperience = (index: number, field: keyof Experience, value: Experience[keyof Experience]) => {
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    update("experience", updated);
  };
  const removeExperience = (index: number) => {
    update("experience", profile.experience.filter((_, i) => i !== index));
  };

  // Education helpers
  const addEducation = () => {
    update("education", [...profile.education, { degree: "", institution: "", startDate: "", endDate: "", gpa: "" }]);
  };
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    update("education", updated);
  };
  const removeEducation = (index: number) => {
    update("education", profile.education.filter((_, i) => i !== index));
  };

  // Project helpers
  const addProject = () => {
    update("projects", [...profile.projects, { name: "", description: "", tech: [], link: "" }]);
  };
  const updateProject = (index: number, field: keyof Project, value: Project[keyof Project]) => {
    const updated = [...profile.projects];
    updated[index] = { ...updated[index], [field]: value };
    update("projects", updated);
  };
  const removeProject = (index: number) => {
    update("projects", profile.projects.filter((_, i) => i !== index));
  };

  if (authLoading || !user || loading) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">CV Profile Builder</h1>
          <p className="text-muted-foreground mt-1">Build your master CV profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : saved ? "Saved!" : "Save Draft"}
          </Button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              i === step
                ? "bg-primary text-primary-foreground"
                : i < step
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs border border-current">
              {i < step ? "\u2713" : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>{STEPS[step]}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="fullName" label="Full Name *" placeholder="John Doe" value={profile.fullName} onChange={(e) => update("fullName", e.target.value)} required />
                    <Input id="email" label="Email *" type="email" placeholder="john@example.com" value={profile.email} onChange={(e) => update("email", e.target.value)} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="phone" label="Phone" placeholder="+1 234 567 8900" value={profile.phone} onChange={(e) => update("phone", e.target.value)} />
                    <Input id="location" label="Location" placeholder="New York, NY" value={profile.location} onChange={(e) => update("location", e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input id="linkedin" label="LinkedIn URL" placeholder="linkedin.com/in/johndoe" value={profile.linkedin} onChange={(e) => update("linkedin", e.target.value)} />
                    <Input id="portfolio" label="Portfolio / Website" placeholder="johndoe.dev" value={profile.portfolio} onChange={(e) => update("portfolio", e.target.value)} />
                  </div>
                </>
              )}

              {step === 1 && (
                <Textarea
                  id="summary"
                  label="Professional Summary"
                  placeholder="A brief professional summary highlighting your key strengths, experience, and career objectives (100-200 words recommended)..."
                  value={profile.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  className="min-h-[200px]"
                />
              )}

              {step === 2 && (
                <>
                  {profile.skills.map((skill, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Category (e.g., Technical, Soft Skills, Tools)"
                          value={skill.category}
                          onChange={(e) => updateSkillCategory(i, "category", e.target.value)}
                          className="max-w-xs"
                        />
                        {profile.skills.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeSkillCategory(i)} className="text-destructive">Remove</Button>
                        )}
                      </div>
                      <Textarea
                        placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                        value={skill.items.join(", ")}
                        onChange={(e) => updateSkillCategory(i, "items", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                  <Button variant="outline" onClick={addSkillCategory}>+ Add Skill Category</Button>
                </>
              )}

              {step === 3 && (
                <>
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Experience {i + 1}</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeExperience(i)} className="text-destructive">Remove</Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                        <Input placeholder="Role / Job Title" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input type="month" placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} label="Start Date" />
                        <div>
                          <Input type="month" placeholder="End Date" value={exp.current ? "" : exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} disabled={exp.current} label="End Date" />
                          <label className="flex items-center gap-2 mt-1.5 text-sm">
                            <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(i, "current", e.target.checked)} className="rounded" />
                            Currently working here
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Key Achievements / Bullet Points</label>
                        {exp.bullets.map((bullet, bi) => (
                          <div key={bi} className="flex gap-2">
                            <Input
                              placeholder="e.g., Led a team of 5 engineers to deliver a $2M project 2 weeks ahead of schedule"
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...exp.bullets];
                                updated[bi] = e.target.value;
                                updateExperience(i, "bullets", updated);
                              }}
                            />
                            {exp.bullets.length > 1 && (
                              <Button variant="ghost" size="icon" onClick={() => {
                                updateExperience(i, "bullets", exp.bullets.filter((_, j) => j !== bi));
                              }} className="text-destructive shrink-0">
                                ×
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" onClick={() => updateExperience(i, "bullets", [...exp.bullets, ""])}>
                          + Add Bullet
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExperience}>+ Add Experience</Button>
                </>
              )}

              {step === 4 && (
                <>
                  {profile.education.map((edu, i) => (
                    <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Education {i + 1}</h4>
                        <Button variant="ghost" size="sm" onClick={() => removeEducation(i)} className="text-destructive">Remove</Button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input placeholder="Degree (e.g., B.Sc. Computer Science)" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                        <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <Input type="month" label="Start Date" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} />
                        <Input type="month" label="End Date" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} />
                        <Input placeholder="GPA (optional)" value={edu.gpa || ""} onChange={(e) => updateEducation(i, "gpa", e.target.value)} label="GPA" />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addEducation}>+ Add Education</Button>
                </>
              )}

              {step === 5 && (
                <>
                  {/* Certifications */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Certifications</h4>
                    <Textarea
                      placeholder="Enter certifications, one per line (e.g., AWS Solutions Architect, PMP, etc.)"
                      value={profile.certifications.join("\n")}
                      onChange={(e) => update("certifications", e.target.value.split("\n").filter(Boolean))}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Projects */}
                  <div className="space-y-3 mt-6">
                    <h4 className="font-medium">Projects</h4>
                    {profile.projects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Project {i + 1}</span>
                          <Button variant="ghost" size="sm" onClick={() => removeProject(i)} className="text-destructive">Remove</Button>
                        </div>
                        <Input placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(i, "name", e.target.value)} />
                        <Textarea placeholder="Description" value={proj.description} onChange={(e) => updateProject(i, "description", e.target.value)} />
                        <Input placeholder="Technologies (comma-separated)" value={proj.tech.join(", ")} onChange={(e) => updateProject(i, "tech", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
                        <Input placeholder="Link (optional)" value={proj.link || ""} onChange={(e) => updateProject(i, "link", e.target.value)} />
                      </div>
                    ))}
                    <Button variant="outline" onClick={addProject}>+ Add Project</Button>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                  Previous
                </Button>
                <div className="flex gap-2">
                  {step === STEPS.length - 1 ? (
                    <Button onClick={async () => { await saveProfile(); router.push("/generate"); }}>
                      Save & Generate CV
                    </Button>
                  ) : (
                    <Button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}>
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-3 max-h-[60vh] overflow-y-auto">
                {/* Mini CV Preview */}
                <div className="text-center border-b border-border pb-2">
                  <div className="font-bold text-sm">{profile.fullName || "Your Name"}</div>
                  <div className="text-muted-foreground">
                    {[profile.email, profile.phone, profile.location].filter(Boolean).join(" | ") || "your@email.com | +1 234 567 8900"}
                  </div>
                  {(profile.linkedin || profile.portfolio) && (
                    <div className="text-muted-foreground">
                      {[profile.linkedin, profile.portfolio].filter(Boolean).join(" | ")}
                    </div>
                  )}
                </div>

                {profile.summary && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Professional Summary</div>
                    <p className="text-muted-foreground leading-relaxed">{profile.summary}</p>
                  </div>
                )}

                {profile.skills.some((s) => s.items.length > 0) && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Skills</div>
                    {profile.skills.filter((s) => s.items.length > 0).map((skill, i) => (
                      <div key={i} className="mb-1">
                        <span className="font-medium">{skill.category}: </span>
                        <span className="text-muted-foreground">{skill.items.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                )}

                {profile.experience.length > 0 && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Experience</div>
                    {profile.experience.map((exp, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{exp.role || "Role"}</span>
                          <span className="text-muted-foreground">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                        </div>
                        <div className="text-muted-foreground italic">{exp.company || "Company"}</div>
                        <ul className="list-disc list-inside text-muted-foreground mt-0.5">
                          {exp.bullets.filter(Boolean).map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {profile.education.length > 0 && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Education</div>
                    {profile.education.map((edu, i) => (
                      <div key={i} className="mb-1">
                        <div className="font-medium">{edu.degree || "Degree"}</div>
                        <div className="text-muted-foreground">{edu.institution} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
                      </div>
                    ))}
                  </div>
                )}

                {profile.certifications.length > 0 && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Certifications</div>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {profile.certifications.map((cert, i) => <li key={i}>{cert}</li>)}
                    </ul>
                  </div>
                )}

                {profile.projects.length > 0 && (
                  <div>
                    <div className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Projects</div>
                    {profile.projects.map((proj, i) => (
                      <div key={i} className="mb-1">
                        <div className="font-medium">{proj.name || "Project"}</div>
                        <div className="text-muted-foreground">{proj.description}</div>
                        {proj.tech.length > 0 && <div className="text-primary/70">{proj.tech.join(", ")}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
