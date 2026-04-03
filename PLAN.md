# ATS CV & Cover Letter Builder - Implementation Plan

## Overview
A full-stack Next.js application that takes a Job Description (JD) + Role + Job URL, tailors your CV for ATS optimization, generates a matching cover letter, produces downloadable PDF/DOCX files, and opens the job application URL.

---

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React + Tailwind CSS + shadcn/ui components
- **Auth**: NextAuth.js (Google + GitHub + Email login)
- **Database**: SQLite via Prisma ORM (easy to upgrade to PostgreSQL later)
- **AI**: Claude API (primary) with OpenAI as fallback option
- **PDF Generation**: @react-pdf/renderer for PDF export
- **DOCX Generation**: docx npm package for Word export
- **ATS Scoring**: Custom keyword matching + AI-powered analysis

---

## Architecture & Features

### Phase 1: Project Setup & Core UI
1. Initialize Next.js 14 project with TypeScript, Tailwind CSS, ESLint
2. Install and configure shadcn/ui component library
3. Set up project folder structure:
   ```
   src/
   ├── app/
   │   ├── (auth)/login/page.tsx
   │   ├── (auth)/register/page.tsx
   │   ├── dashboard/page.tsx
   │   ├── cv-builder/page.tsx
   │   ├── generate/page.tsx
   │   ├── api/
   │   │   ├── auth/[...nextauth]/route.ts
   │   │   ├── cv/route.ts
   │   │   ├── generate/route.ts
   │   │   └── ats-score/route.ts
   │   ├── layout.tsx
   │   └── page.tsx (landing page)
   ├── components/
   │   ├── ui/ (shadcn components)
   │   ├── cv-form.tsx
   │   ├── cv-preview.tsx
   │   ├── cover-letter-preview.tsx
   │   ├── ats-score-card.tsx
   │   ├── jd-input.tsx
   │   └── navbar.tsx
   ├── lib/
   │   ├── ai/claude.ts
   │   ├── ai/openai.ts
   │   ├── ats-scorer.ts
   │   ├── pdf-generator.ts
   │   ├── docx-generator.ts
   │   ├── prisma.ts
   │   └── utils.ts
   └── prisma/
       └── schema.prisma
   ```

### Phase 2: Authentication & Database
4. Set up Prisma schema with models:
   - **User**: id, name, email, password, image, accounts
   - **CVProfile**: id, userId, fullName, email, phone, location, summary, skills, experience (JSON), education (JSON), certifications, projects
   - **GeneratedCV**: id, userId, cvProfileId, jobTitle, company, jobDescription, tailoredCV (JSON), coverLetter, atsScore, createdAt
5. Configure NextAuth with credentials provider (email/password)
6. Build login/register pages

### Phase 3: CV Profile Builder
7. Build multi-step CV input form:
   - Step 1: Personal Info (name, email, phone, location, LinkedIn, portfolio)
   - Step 2: Professional Summary
   - Step 3: Skills (categorized: technical, soft, tools)
   - Step 4: Work Experience (company, role, dates, bullet points)
   - Step 5: Education (degree, institution, dates, GPA)
   - Step 6: Certifications & Projects
8. Save CV profile to database
9. Real-time CV preview panel (side-by-side)

### Phase 4: AI-Powered CV Tailoring & Cover Letter
10. Build JD input page with fields:
    - Job Title / Role
    - Company Name
    - Job Description (paste full JD)
    - Job URL (for applying later)
11. AI Processing Pipeline:
    - Parse JD to extract: required skills, preferred skills, responsibilities, keywords
    - Match against user's CV profile
    - Rewrite summary to align with JD
    - Reorder & emphasize relevant skills
    - Rephrase experience bullet points with JD keywords
    - Calculate ATS score (keyword match %, format score, section completeness)
12. Generate cover letter:
    - Personalized to company & role
    - Highlights matching experience
    - Professional tone, 3-4 paragraphs
    - Includes specific JD keywords

### Phase 5: ATS Score & Optimization
13. ATS Scoring Engine:
    - Keyword density match (JD keywords found in CV)
    - Section completeness check
    - Format compatibility score
    - Action verb usage
    - Quantified achievements detection
    - Overall score out of 100
14. Display score with breakdown and improvement suggestions
15. Allow re-generation with higher optimization

### Phase 6: Export & Apply
16. PDF Export: Clean, ATS-friendly single-column PDF
17. DOCX Export: Word-compatible format
18. "Apply Now" button:
    - Opens job URL in new tab
    - Downloads generated CV + cover letter files
    - Copies cover letter to clipboard
19. Application history tracking (save all generated versions)

---

## Key Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `package.json` | Dependencies & scripts |
| 2 | `next.config.js` | Next.js configuration |
| 3 | `tailwind.config.ts` | Tailwind + shadcn theme |
| 4 | `prisma/schema.prisma` | Database schema |
| 5 | `src/app/layout.tsx` | Root layout with providers |
| 6 | `src/app/page.tsx` | Landing page |
| 7 | `src/app/(auth)/login/page.tsx` | Login page |
| 8 | `src/app/dashboard/page.tsx` | User dashboard |
| 9 | `src/app/cv-builder/page.tsx` | CV profile builder |
| 10 | `src/app/generate/page.tsx` | JD input + generation page |
| 11 | `src/app/api/auth/[...nextauth]/route.ts` | Auth API |
| 12 | `src/app/api/generate/route.ts` | AI generation API |
| 13 | `src/app/api/ats-score/route.ts` | ATS scoring API |
| 14 | `src/lib/ai/claude.ts` | Claude API integration |
| 15 | `src/lib/ats-scorer.ts` | ATS scoring logic |
| 16 | `src/lib/pdf-generator.ts` | PDF export |
| 17 | `src/lib/docx-generator.ts` | DOCX export |
| 18 | `src/components/cv-form.tsx` | CV input form |
| 19 | `src/components/cv-preview.tsx` | Live CV preview |
| 20 | `src/components/cover-letter-preview.tsx` | Cover letter display |
| 21 | `src/components/ats-score-card.tsx` | ATS score visualization |

---

## Implementation Order
1. **Phase 1**: Project setup, install deps, configure Tailwind + shadcn (~10 files)
2. **Phase 2**: Prisma schema, NextAuth setup, login/register UI (~6 files)
3. **Phase 3**: CV profile form + preview + save to DB (~5 files)
4. **Phase 4**: JD input, Claude API integration, CV tailoring + cover letter generation (~5 files)
5. **Phase 5**: ATS scoring engine + score display UI (~3 files)
6. **Phase 6**: PDF/DOCX export, Apply Now feature, history page (~4 files)

---

## Environment Variables Needed
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your-claude-api-key"
OPENAI_API_KEY="your-openai-api-key"  # optional fallback
```
