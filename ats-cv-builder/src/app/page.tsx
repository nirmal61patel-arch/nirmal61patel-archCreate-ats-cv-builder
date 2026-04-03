"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              AI-Powered ATS Optimization
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Land More Interviews with{" "}
              <span className="text-primary">ATS-Optimized</span> CVs
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Paste any job description, and our AI instantly tailors your CV for maximum ATS compatibility.
              Get a matching cover letter and ATS score - all in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={user ? "/generate" : "/register"}>
                <Button size="lg" className="text-base px-8 h-13 shadow-lg shadow-primary/25">
                  {user ? "Generate Tailored CV" : "Get Started Free"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <Link href={user ? "/cv-builder" : "/login"}>
                <Button variant="outline" size="lg" className="text-base px-8 h-13">
                  {user ? "Build Your CV" : "Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to your perfect CV</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Build Your CV Profile",
                description: "Enter your experience, skills, education, and projects once. We save it securely for all your applications.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "Paste Job Description",
                description: "Paste the JD from any job listing. Our AI extracts keywords, requirements, and skills the ATS is looking for.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "Get Tailored CV + Cover Letter",
                description: "Download your ATS-optimized CV and matching cover letter as PDF or DOCX. Apply directly with one click.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <Card key={feature.step} className="relative overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5">
                    {feature.step}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">3 ATS-Friendly Templates</h2>
            <p className="text-muted-foreground text-lg">Choose the perfect style for your industry</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Classic Professional", desc: "Traditional single-column layout. Best for corporate, finance, and government roles.", color: "from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" },
              { name: "Modern Minimal", desc: "Clean contemporary design with subtle accents. Best for tech, startups, and creative roles.", color: "from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950" },
              { name: "Executive", desc: "Bold structured layout with highlights sidebar. Best for senior and management positions.", color: "from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-950" },
            ].map((template) => (
              <Card key={template.name} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <div className="w-32 h-40 bg-white dark:bg-gray-800 rounded shadow-lg p-3 transform group-hover:scale-105 transition-transform">
                    <div className="h-2 w-16 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                    <div className="h-1.5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded mb-0.5" />
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded mb-0.5" />
                    <div className="h-1 w-16 bg-gray-100 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded mb-0.5" />
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded mb-0.5" />
                    <div className="h-1 w-24 bg-gray-100 dark:bg-gray-700 rounded" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Beat the ATS?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of job seekers who land interviews with AI-optimized CVs.
          </p>
          <Link href={user ? "/generate" : "/register"}>
            <Button size="lg" className="text-base px-10 h-13">
              Start Building Your CV
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>ATS CV Builder - AI-Powered Resume Optimization Tool</p>
        </div>
      </footer>
    </div>
  );
}
