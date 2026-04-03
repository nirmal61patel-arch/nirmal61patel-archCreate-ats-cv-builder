"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

interface GeneratedEntry {
  id: string;
  jobTitle: string;
  company: string;
  atsScore: number;
  createdAt: string;
  jobUrl?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<GeneratedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch("/api/cv").then((r) => r.json()),
      fetch("/api/generate").then((r) => r.json()),
    ]).then(([cvData, genData]) => {
      setProfileExists(cvData.profiles?.length > 0);
      setHistory(genData.history || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950";
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your CVs and track your applications</p>
        </div>
        <div className="flex gap-3">
          <Link href="/cv-builder">
            <Button variant={profileExists ? "outline" : "default"}>
              {profileExists ? "Edit CV Profile" : "Create CV Profile"}
            </Button>
          </Link>
          {profileExists && (
            <Link href="/generate">
              <Button>Generate Tailored CV</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total Applications</div>
            <div className="text-3xl font-bold mt-1">{history.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Average ATS Score</div>
            <div className="text-3xl font-bold mt-1">
              {history.length > 0
                ? Math.round(history.reduce((sum, h) => sum + h.atsScore, 0) / history.length)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Highest Score</div>
            <div className="text-3xl font-bold mt-1">
              {history.length > 0 ? Math.max(...history.map((h) => h.atsScore)) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {!profileExists && !loading && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2">Get Started</h3>
            <p className="text-muted-foreground mb-4">
              Create your CV profile first, then you can generate tailored CVs for any job description.
            </p>
            <Link href="/cv-builder">
              <Button>Create Your CV Profile</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Application History */}
      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No applications yet.</p>
              <p className="text-sm mt-1">Generate your first tailored CV to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{entry.jobTitle}</h4>
                    <p className="text-sm text-muted-foreground">{entry.company}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(entry.atsScore)}`}>
                      ATS: {entry.atsScore}%
                    </div>
                    {entry.jobUrl && (
                      <a href={entry.jobUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">Apply</Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
