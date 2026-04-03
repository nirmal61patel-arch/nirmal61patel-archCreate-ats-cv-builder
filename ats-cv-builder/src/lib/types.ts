export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface CVProfileData {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  projects: Project[];
}

export interface TailoredCVData extends CVProfileData {
  tailoredSummary: string;
  tailoredSkills: SkillCategory[];
  tailoredExperience: Experience[];
  keywordsMatched: string[];
  keywordsMissing: string[];
}

export interface ATSScoreBreakdown {
  keywordMatch: number;
  formatScore: number;
  sectionCompleteness: number;
  actionVerbs: number;
  quantifiedAchievements: number;
  overall: number;
  suggestions: string[];
}

export interface GenerationResult {
  tailoredCV: TailoredCVData;
  coverLetter: string;
  atsScore: ATSScoreBreakdown;
}

export type TemplateType = "classic" | "modern" | "executive";
