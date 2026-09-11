import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { SiteNav } from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in: SPATIA Spatial Learning" },
      {
        name: "description",
        content:
          "Create a free SPATIA account to save your study tracker, flashcard decks and focus sessions across every 3D learning module.",
      },
      { property: "og:title", content: "Sign in: SPATIA Spatial Learning" },
      { property: "og:description", content: "Save study progress, flashcards and focus sessions across devices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: name }, emailRedirectTo: window.location.origin + "/" },
        });
        if (error) throw error;
        if (data.session) {
            navigate({ to: "/" });
          return;
        }
        setMessage("Check your inbox to confirm your email, then sign in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/" });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/" },
    });
    if (error) {
      setMessage("Google sign-in failed. Try email instead.");
      setBusy(false);
      return;
    }
    if (data.url) return;
    navigate({ to: "/" });
  }

  return (
    <main className="relative min-h-[100dvh]">
      <AnimatedBackdrop />
      <SiteNav />
      <section className="mx-auto flex w-full max-w-md flex-col px-4 pt-12 pb-16">
        <h1 className="text-4xl font-bold tracking-tighter">{mode === "signin" ? "Welcome back" : "Start your study log"}</h1>
        <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-gray-600">
          Your progress tracker, flashcard decks and focus sessions are saved to your account and follow you to any device.
        </p>

        <div className="mt-8 border border-border/70 bg-surface p-6" style={{ borderRadius: 16 }}>
          <button
            onClick={google}
            disabled={busy}
            className="w-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary disabled:opacity-50"
            style={{ borderRadius: 12 }}
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">or email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" ? (
              <div className="space-y-2">
                <label htmlFor="auth-name" className="text-xs font-medium text-foreground">Your name</label>
                <input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  autoComplete="name"
                  className="w-full border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                  style={{ borderRadius: 12 }}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="auth-email" className="text-xs font-medium text-foreground">Email</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                autoComplete="email"
                className="w-full border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                style={{ borderRadius: 12 }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="auth-password" className="text-xs font-medium text-foreground">Password</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                style={{ borderRadius: 12 }}
              />
              <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ borderRadius: 12 }}
            >
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {message ? (
            <p role={message.includes("inbox") ? "status" : "alert"} className="mt-4 border border-border/70 bg-surface-raised px-3 py-2 text-xs leading-relaxed text-foreground" style={{ borderRadius: 12 }}>{message}</p>
          ) : null}

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center text-xs text-muted-foreground hover:text-primary"
          >
            {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </main>
  );
}
