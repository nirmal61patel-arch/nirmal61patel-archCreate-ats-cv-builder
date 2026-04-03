"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import type { TailoredCVData, ATSScoreBreakdown, TemplateType } from "@/lib/types";

export default function GeneratePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<{ id: string; fullName: string }[]>([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState<TemplateType>("modern");

  // Results
  const [tailoredCV, setTailoredCV] = useState<TailoredCVData | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [atsScore, setAtsScore] = useState<ATSScoreBreakdown | null>(null);
  const [activeTab, setActiveTab] = useState<"cv" | "cover" | "score">("cv");

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/cv")
      .then((r) => r.json())
      .then((data) => {
        if (data.profiles?.length > 0) {
          setProfiles(data.profiles.map((p: { id: string; fullName: string }) => ({ id: p.id, fullName: p.fullName })));
          setSelectedProfile(data.profiles[0].id);
        }
      });
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedProfile || !jobTitle || !jobDescription) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setGenerating(true);
    setTailoredCV(null);
    setCoverLetter("");
    setAtsScore(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvProfileId: selectedProfile,
          jobTitle,
          company,
          jobDescription,
          jobUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate");
        setGenerating(false);
        return;
      }

      setTailoredCV(data.tailoredCV);
      setCoverLetter(data.coverLetter);
      setAtsScore(data.atsScore);
      setActiveTab("score");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Network error. Please try again.");
    }

    setGenerating(false);
  };

  const downloadPDF = () => {
    if (!tailoredCV) return;
    // Create a printable HTML document
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const cvHTML = generateCVHTML(tailoredCV, template);
    printWindow.document.write(cvHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const downloadCoverLetterPDF = () => {
    if (!coverLetter || !tailoredCV) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Cover Letter - ${tailoredCV.fullName}</title>
<style>
  body { font-family: 'Georgia', serif; max-width: 700px; margin: 40px auto; padding: 40px; line-height: 1.8; color: #333; font-size: 12pt; }
  @media print { body { margin: 0; padding: 20px 40px; } }
</style></head>
<body><pre style="white-space: pre-wrap; font-family: inherit;">${coverLetter}</pre></body></html>`);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const applyNow = () => {
    if (jobUrl) {
      window.open(jobUrl, "_blank");
    }
    if (coverLetter) {
      copyToClipboard(coverLetter);
    }
    downloadPDF();
  };

  if (authLoading || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Generate Tailored CV</h1>
        <p className="text-muted-foreground mt-1">Paste a job description to get an ATS-optimized CV and cover letter</p>
      </div>

      {profiles.length === 0 ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No CV Profile Found</h3>
            <p className="text-muted-foreground mb-4">Create your CV profile first before generating tailored CVs.</p>
            <Button onClick={() => router.push("/cv-builder")}>Create CV Profile</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">CV Profile</label>
                  <select
                    value={selectedProfile}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>{p.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Template Style</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as TemplateType)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="modern">Modern Minimal</option>
                    <option value="classic">Classic Professional</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="jobTitle" label="Job Title / Role *" placeholder="Senior Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                <Input id="company" label="Company Name" placeholder="Google" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>

              <Textarea
                id="jobDescription"
                label="Job Description *"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />

              <Input id="jobUrl" label="Job Application URL" placeholder="https://careers.google.com/jobs/..." value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} />

              <Button onClick={handleGenerate} disabled={generating} className="w-full h-12 text-base">
                {generating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI is tailoring your CV...
                  </span>
                ) : (
                  "Generate Tailored CV & Cover Letter"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          {(tailoredCV || atsScore) && (
            <div ref={resultsRef}>
              {/* ATS Score Overview */}
              {atsScore && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                  <Card className="lg:col-span-2">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                          <circle
                            cx="50" cy="50" r="45"
                            stroke="currentColor" strokeWidth="8" fill="none"
                            className={`score-ring ${atsScore.overall >= 80 ? "text-green-500" : atsScore.overall >= 60 ? "text-yellow-500" : "text-red-500"}`}
                            strokeDasharray="283"
                            strokeDashoffset={283 - (283 * atsScore.overall) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{atsScore.overall}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">ATS Score</div>
                        <div className="text-2xl font-bold">{atsScore.overall}/100</div>
                        <div className={`text-xs ${atsScore.overall >= 80 ? "text-green-600" : atsScore.overall >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                          {atsScore.overall >= 80 ? "Excellent" : atsScore.overall >= 60 ? "Good" : "Needs Work"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {[
                    { label: "Keywords", value: atsScore.keywordMatch },
                    { label: "Format", value: atsScore.formatScore },
                    { label: "Sections", value: atsScore.sectionCompleteness },
                    { label: "Action Verbs", value: atsScore.actionVerbs },
                  ].map((item) => (
                    <Card key={item.label}>
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                        <div className="text-2xl font-bold mt-1">{item.value}%</div>
                        <div className="h-1.5 bg-muted rounded-full mt-2">
                          <div
                            className={`h-full rounded-full transition-all ${item.value >= 80 ? "bg-green-500" : item.value >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {atsScore && atsScore.suggestions.length > 0 && (
                <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Improvement Suggestions</h4>
                    <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                      {atsScore.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-0.5">&#x26A0;</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for CV / Cover Letter / Score Details */}
              <div className="flex gap-1 mb-4 border-b border-border">
                {[
                  { key: "cv" as const, label: "Tailored CV" },
                  { key: "cover" as const, label: "Cover Letter" },
                  { key: "score" as const, label: "Score Details" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                      activeTab === tab.key
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <Card>
                <CardContent className="p-6">
                  {activeTab === "cv" && tailoredCV && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Your Tailored CV</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={downloadPDF}>
                            Download PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatCVAsText(tailoredCV))}>
                            Copy Text
                          </Button>
                        </div>
                      </div>

                      {/* CV Preview */}
                      <div className="border border-border rounded-lg p-6 bg-white dark:bg-gray-900 text-sm space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="text-center border-b pb-3">
                          <h2 className="text-xl font-bold">{tailoredCV.fullName}</h2>
                          <p className="text-muted-foreground text-xs mt-1">
                            {[tailoredCV.email, tailoredCV.phone, tailoredCV.location].filter(Boolean).join(" | ")}
                          </p>
                          {(tailoredCV.linkedin || tailoredCV.portfolio) && (
                            <p className="text-muted-foreground text-xs">
                              {[tailoredCV.linkedin, tailoredCV.portfolio].filter(Boolean).join(" | ")}
                            </p>
                          )}
                        </div>

                        {tailoredCV.tailoredSummary && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Professional Summary</h3>
                            <p className="text-muted-foreground leading-relaxed">{tailoredCV.tailoredSummary}</p>
                          </div>
                        )}

                        {tailoredCV.tailoredSkills && tailoredCV.tailoredSkills.length > 0 && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Skills</h3>
                            {tailoredCV.tailoredSkills.map((skill, i) => (
                              <div key={i} className="mb-1">
                                <span className="font-medium">{skill.category}: </span>
                                <span className="text-muted-foreground">{skill.items.join(", ")}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {tailoredCV.tailoredExperience && tailoredCV.tailoredExperience.length > 0 && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Experience</h3>
                            {tailoredCV.tailoredExperience.map((exp, i) => (
                              <div key={i} className="mb-3">
                                <div className="flex justify-between">
                                  <span className="font-semibold">{exp.role}</span>
                                  <span className="text-xs text-muted-foreground">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                                </div>
                                <div className="text-muted-foreground italic text-xs">{exp.company}</div>
                                <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-0.5">
                                  {exp.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}

                        {tailoredCV.education && tailoredCV.education.length > 0 && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Education</h3>
                            {tailoredCV.education.map((edu, i) => (
                              <div key={i} className="mb-1">
                                <div className="font-medium">{edu.degree}</div>
                                <div className="text-muted-foreground text-xs">{edu.institution} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {tailoredCV.certifications && tailoredCV.certifications.length > 0 && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Certifications</h3>
                            <ul className="list-disc list-inside text-muted-foreground">
                              {tailoredCV.certifications.map((c, i) => <li key={i}>{c}</li>)}
                            </ul>
                          </div>
                        )}

                        {tailoredCV.projects && tailoredCV.projects.length > 0 && (
                          <div>
                            <h3 className="font-bold text-xs uppercase tracking-wider text-primary border-b border-primary/20 pb-1 mb-2">Projects</h3>
                            {tailoredCV.projects.map((p, i) => (
                              <div key={i} className="mb-2">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-muted-foreground text-xs">{p.description}</div>
                                {p.tech.length > 0 && <div className="text-xs text-primary/60 mt-0.5">{p.tech.join(", ")}</div>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Keywords matched */}
                        {tailoredCV.keywordsMatched && tailoredCV.keywordsMatched.length > 0 && (
                          <div className="border-t pt-3 mt-4">
                            <h4 className="text-xs font-medium text-green-600 mb-1">Keywords Matched ({tailoredCV.keywordsMatched.length})</h4>
                            <div className="flex flex-wrap gap-1">
                              {tailoredCV.keywordsMatched.map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded text-xs">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {tailoredCV.keywordsMissing && tailoredCV.keywordsMissing.length > 0 && (
                          <div>
                            <h4 className="text-xs font-medium text-red-600 mb-1">Keywords Missing ({tailoredCV.keywordsMissing.length})</h4>
                            <div className="flex flex-wrap gap-1">
                              {tailoredCV.keywordsMissing.map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 rounded text-xs">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "cover" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Cover Letter</h3>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={downloadCoverLetterPDF}>
                            Download PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(coverLetter)}>
                            Copy to Clipboard
                          </Button>
                        </div>
                      </div>
                      <div className="border border-border rounded-lg p-6 bg-white dark:bg-gray-900 text-sm leading-relaxed whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                        {coverLetter}
                      </div>
                    </div>
                  )}

                  {activeTab === "score" && atsScore && (
                    <div className="space-y-6">
                      <h3 className="font-semibold">ATS Score Breakdown</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { label: "Keyword Match", value: atsScore.keywordMatch, desc: "How many JD keywords appear in your CV" },
                          { label: "Format Score", value: atsScore.formatScore, desc: "ATS-friendly formatting compliance" },
                          { label: "Section Completeness", value: atsScore.sectionCompleteness, desc: "All important CV sections present" },
                          { label: "Action Verbs", value: atsScore.actionVerbs, desc: "Use of strong action verbs in bullets" },
                          { label: "Quantified Achievements", value: atsScore.quantifiedAchievements, desc: "Numbers and metrics in experience" },
                        ].map((item) => (
                          <div key={item.label} className="p-4 rounded-lg border border-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium">{item.label}</span>
                              <span className={`text-sm font-bold ${item.value >= 80 ? "text-green-600" : item.value >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                                {item.value}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full mb-2">
                              <div
                                className={`h-full rounded-full transition-all ${item.value >= 80 ? "bg-green-500" : item.value >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Apply Now Button */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {jobUrl && (
                  <Button size="lg" className="flex-1" onClick={applyNow}>
                    Apply Now - Open Job URL + Download Files
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15,3 21,3 21,9" /><line x1="10" x2="21" y1="14" y2="3" />
                    </svg>
                  </Button>
                )}
                <Button variant="outline" size="lg" onClick={downloadPDF}>
                  Download CV (PDF)
                </Button>
                <Button variant="outline" size="lg" onClick={downloadCoverLetterPDF}>
                  Download Cover Letter (PDF)
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function formatCVAsText(cv: TailoredCVData): string {
  let text = `${cv.fullName}\n`;
  text += [cv.email, cv.phone, cv.location].filter(Boolean).join(" | ") + "\n";
  if (cv.linkedin || cv.portfolio) text += [cv.linkedin, cv.portfolio].filter(Boolean).join(" | ") + "\n";
  text += "\n";

  if (cv.tailoredSummary) text += `PROFESSIONAL SUMMARY\n${cv.tailoredSummary}\n\n`;

  if (cv.tailoredSkills?.length) {
    text += "SKILLS\n";
    cv.tailoredSkills.forEach((s) => { text += `${s.category}: ${s.items.join(", ")}\n`; });
    text += "\n";
  }

  if (cv.tailoredExperience?.length) {
    text += "EXPERIENCE\n";
    cv.tailoredExperience.forEach((e) => {
      text += `${e.role} | ${e.company} | ${e.startDate} - ${e.current ? "Present" : e.endDate}\n`;
      e.bullets.forEach((b) => { text += `  - ${b}\n`; });
      text += "\n";
    });
  }

  if (cv.education?.length) {
    text += "EDUCATION\n";
    cv.education.forEach((e) => {
      text += `${e.degree} | ${e.institution}${e.gpa ? ` | GPA: ${e.gpa}` : ""}\n`;
    });
    text += "\n";
  }

  if (cv.certifications?.length) {
    text += "CERTIFICATIONS\n";
    cv.certifications.forEach((c) => { text += `  - ${c}\n`; });
    text += "\n";
  }

  if (cv.projects?.length) {
    text += "PROJECTS\n";
    cv.projects.forEach((p) => {
      text += `${p.name}: ${p.description}\n`;
      if (p.tech.length) text += `Technologies: ${p.tech.join(", ")}\n`;
      text += "\n";
    });
  }

  return text;
}

function generateCVHTML(cv: TailoredCVData, template: TemplateType): string {
  const styles: Record<TemplateType, { headColor: string; font: string; headerBg: string }> = {
    classic: { headColor: "#1a1a1a", font: "'Georgia', serif", headerBg: "#f5f5f5" },
    modern: { headColor: "#2563eb", font: "'Helvetica Neue', Arial, sans-serif", headerBg: "#ffffff" },
    executive: { headColor: "#92400e", font: "'Palatino', serif", headerBg: "#fef3c7" },
  };

  const s = styles[template];

  return `<!DOCTYPE html>
<html><head><title>CV - ${cv.fullName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${s.font}; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; font-size: 11pt; line-height: 1.5; }
  @media print { body { padding: 20px 30px; } }
  .header { text-align: center; padding: 16px; margin-bottom: 16px; background: ${s.headerBg}; border-radius: 4px; }
  .header h1 { font-size: 22pt; color: ${s.headColor}; margin-bottom: 4px; }
  .header p { font-size: 9pt; color: #666; }
  .section { margin-bottom: 14px; }
  .section-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: ${s.headColor}; border-bottom: 2px solid ${s.headColor}; padding-bottom: 3px; margin-bottom: 8px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
  .exp-role { font-weight: bold; font-size: 11pt; }
  .exp-date { font-size: 9pt; color: #888; }
  .exp-company { font-style: italic; color: #555; font-size: 10pt; }
  ul { margin-left: 18px; margin-top: 4px; }
  li { margin-bottom: 2px; }
  .skills-row { margin-bottom: 3px; }
  .skills-cat { font-weight: bold; }
</style></head>
<body>
  <div class="header">
    <h1>${cv.fullName}</h1>
    <p>${[cv.email, cv.phone, cv.location].filter(Boolean).join(" | ")}</p>
    ${(cv.linkedin || cv.portfolio) ? `<p>${[cv.linkedin, cv.portfolio].filter(Boolean).join(" | ")}</p>` : ""}
  </div>

  ${cv.tailoredSummary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${cv.tailoredSummary}</p>
  </div>` : ""}

  ${cv.tailoredSkills?.length ? `
  <div class="section">
    <div class="section-title">Skills</div>
    ${cv.tailoredSkills.map((sk) => `<div class="skills-row"><span class="skills-cat">${sk.category}:</span> ${sk.items.join(", ")}</div>`).join("")}
  </div>` : ""}

  ${cv.tailoredExperience?.length ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${cv.tailoredExperience.map((e) => `
      <div style="margin-bottom: 12px;">
        <div class="exp-header"><span class="exp-role">${e.role}</span><span class="exp-date">${e.startDate} - ${e.current ? "Present" : e.endDate}</span></div>
        <div class="exp-company">${e.company}</div>
        <ul>${e.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
      </div>
    `).join("")}
  </div>` : ""}

  ${cv.education?.length ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${cv.education.map((e) => `<div><strong>${e.degree}</strong> - ${e.institution}${e.gpa ? ` | GPA: ${e.gpa}` : ""}</div>`).join("")}
  </div>` : ""}

  ${cv.certifications?.length ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    <ul>${cv.certifications.map((c) => `<li>${c}</li>`).join("")}</ul>
  </div>` : ""}

  ${cv.projects?.length ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${cv.projects.map((p) => `<div style="margin-bottom: 8px;"><strong>${p.name}</strong><br/>${p.description}${p.tech.length ? `<br/><em>${p.tech.join(", ")}</em>` : ""}</div>`).join("")}
  </div>` : ""}
</body></html>`;
}
