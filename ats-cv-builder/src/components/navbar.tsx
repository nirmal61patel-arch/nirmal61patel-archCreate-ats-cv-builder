"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";
import { Button } from "./ui/button";
import { useState } from "react";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ATS</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">CV Builder</span>
        </Link>

        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-4">
                  <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/cv-builder" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    CV Builder
                  </Link>
                  <Link href="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Generate
                  </Link>
                </div>

                {/* Mobile menu */}
                <div className="sm:hidden relative">
                  <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" x2="20" y1="12" y2="12" />
                      <line x1="4" x2="20" y1="6" y2="6" />
                      <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                  </Button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-2">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                      <Link href="/cv-builder" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>CV Builder</Link>
                      <Link href="/generate" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Generate</Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
