import type { CVProfileData, ATSScoreBreakdown } from "./types";

const ACTION_VERBS = [
  "achieved", "administered", "analyzed", "built", "collaborated", "created",
  "delivered", "designed", "developed", "directed", "drove", "engineered",
  "established", "executed", "expanded", "generated", "implemented", "improved",
  "increased", "initiated", "integrated", "launched", "led", "managed",
  "mentored", "migrated", "negotiated", "optimized", "orchestrated", "overhauled",
  "pioneered", "planned", "produced", "reduced", "refactored", "resolved",
  "revamped", "scaled", "secured", "spearheaded", "streamlined", "supervised",
  "trained", "transformed", "upgraded",
];

function extractKeywords(jd: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "need", "must",
    "that", "this", "these", "those", "it", "its", "we", "our", "you",
    "your", "they", "their", "he", "she", "his", "her", "as", "if", "not",
    "no", "so", "up", "out", "about", "who", "which", "what", "when",
    "where", "how", "all", "each", "every", "both", "few", "more", "most",
    "other", "some", "such", "than", "too", "very", "just", "also",
    "work", "working", "role", "position", "job", "team", "ability",
    "experience", "years", "required", "preferred", "including", "using",
    "strong", "excellent", "good", "well", "looking", "join", "etc",
  ]);

  const words = jd.toLowerCase()
    .replace(/[^a-zA-Z0-9\s\+\#\.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // Also extract multi-word phrases (2-3 words)
  const text = jd.toLowerCase();
  const techPatterns = [
    /(?:react|angular|vue|next|nuxt|svelte|gatsby)\.?js?/gi,
    /node\.?js/gi,
    /type\s?script/gi,
    /java\s?script/gi,
    /machine\s+learning/gi,
    /deep\s+learning/gi,
    /data\s+science/gi,
    /ci\s*\/?\s*cd/gi,
    /rest\s*(?:ful)?\s*api/gi,
    /cloud\s+computing/gi,
    /project\s+management/gi,
    /agile\s+(?:methodology|scrum)/gi,
    /version\s+control/gi,
    /unit\s+test(?:ing|s)?/gi,
    /micro\s*services?/gi,
    /full\s*[-\s]?stack/gi,
    /front\s*[-\s]?end/gi,
    /back\s*[-\s]?end/gi,
  ];

  const phrases: string[] = [];
  for (const pattern of techPatterns) {
    const matches = text.match(pattern);
    if (matches) phrases.push(...matches.map((m) => m.trim().toLowerCase()));
  }

  // Count frequency and keep important keywords
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const keywords = Object.entries(freq)
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);

  return [...new Set([...keywords, ...phrases])];
}

export function calculateATSScore(
  cv: CVProfileData,
  jobDescription: string
): ATSScoreBreakdown {
  const jdKeywords = extractKeywords(jobDescription);
  const cvText = [
    cv.summary,
    cv.skills.map((s) => s.items.join(" ")).join(" "),
    cv.experience.map((e) => [e.role, e.company, ...e.bullets].join(" ")).join(" "),
    cv.education.map((e) => [e.degree, e.institution].join(" ")).join(" "),
    cv.certifications.join(" "),
    cv.projects.map((p) => [p.name, p.description, ...p.tech].join(" ")).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  // 1. Keyword Match Score
  const matchedKeywords = jdKeywords.filter((kw) => cvText.includes(kw));
  const keywordMatch = jdKeywords.length > 0
    ? Math.round((matchedKeywords.length / jdKeywords.length) * 100)
    : 0;

  // 2. Format Score (ATS-friendly format checks)
  let formatScore = 100;
  if (!cv.email) formatScore -= 15;
  if (!cv.phone) formatScore -= 10;
  if (!cv.location) formatScore -= 5;
  if (!cv.linkedin) formatScore -= 5;
  if (cv.summary && cv.summary.length < 50) formatScore -= 10;
  if (cv.summary && cv.summary.length > 500) formatScore -= 5;
  formatScore = Math.max(0, formatScore);

  // 3. Section Completeness
  let sectionCompleteness = 0;
  if (cv.fullName) sectionCompleteness += 15;
  if (cv.email) sectionCompleteness += 10;
  if (cv.phone) sectionCompleteness += 5;
  if (cv.summary && cv.summary.length > 30) sectionCompleteness += 15;
  if (cv.skills.length > 0) sectionCompleteness += 15;
  if (cv.experience.length > 0) sectionCompleteness += 20;
  if (cv.education.length > 0) sectionCompleteness += 10;
  if (cv.certifications.length > 0) sectionCompleteness += 5;
  if (cv.projects.length > 0) sectionCompleteness += 5;

  // 4. Action Verbs Score
  const allBullets = cv.experience.flatMap((e) => e.bullets).join(" ").toLowerCase();
  const usedVerbs = ACTION_VERBS.filter((v) => allBullets.includes(v));
  const actionVerbs = Math.min(100, Math.round((usedVerbs.length / Math.max(cv.experience.length * 2, 1)) * 100));

  // 5. Quantified Achievements
  const bulletCount = cv.experience.flatMap((e) => e.bullets).length;
  const quantifiedBullets = cv.experience
    .flatMap((e) => e.bullets)
    .filter((b) => /\d+%?|\$\d+|#\d+|\d+\+/.test(b)).length;
  const quantifiedAchievements = bulletCount > 0
    ? Math.round((quantifiedBullets / bulletCount) * 100)
    : 0;

  // Overall weighted score
  const overall = Math.round(
    keywordMatch * 0.35 +
    formatScore * 0.15 +
    sectionCompleteness * 0.20 +
    actionVerbs * 0.15 +
    quantifiedAchievements * 0.15
  );

  // Generate suggestions
  const suggestions: string[] = [];
  const missingKeywords = jdKeywords.filter((kw) => !cvText.includes(kw));

  if (keywordMatch < 70) {
    suggestions.push(`Add missing keywords: ${missingKeywords.slice(0, 5).join(", ")}`);
  }
  if (!cv.summary || cv.summary.length < 50) {
    suggestions.push("Add a detailed professional summary (100-200 words)");
  }
  if (quantifiedAchievements < 50) {
    suggestions.push("Add more quantified achievements (numbers, percentages, dollar amounts)");
  }
  if (actionVerbs < 50) {
    suggestions.push("Start bullet points with strong action verbs (Led, Developed, Implemented, etc.)");
  }
  if (!cv.linkedin) {
    suggestions.push("Add your LinkedIn profile URL");
  }
  if (cv.skills.length === 0) {
    suggestions.push("Add a skills section with categorized technical and soft skills");
  }
  if (cv.certifications.length === 0) {
    suggestions.push("Consider adding relevant certifications");
  }

  return {
    keywordMatch,
    formatScore,
    sectionCompleteness,
    actionVerbs,
    quantifiedAchievements,
    overall,
    suggestions,
  };
}
