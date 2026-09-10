import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AnimatedBackdrop } from "@/components/AnimatedBackdrop";
import { SiteNav } from "@/components/SiteNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — SPATIA Spatial Learning" },
      {
        name: "description",
        content:
          "Create a free SPATIA account to save your study tracker, flashcard decks and focus sessions across every 3D learning module.",
      },
      { property: "og:title", content: "Sign in — SPATIA Spatial Learning" },
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
    <main className="relative min-h-screen">
      <AnimatedBackdrop />
      <SiteNav />
      <section className="mx-auto flex max-w-md flex-col px-6 pt-12 pb-16">
        <p className="label-mono text-primary">Student account</p>
        <h1 className="mt-2 text-3xl font-bold">{mode === "signin" ? "Welcome back" : "Start your study log"}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Your progress tracker, flashcard decks and focus sessions are saved to your account and follow you to any device.
        </p>

        <div className="panel mt-8 p-6">
          <button
            onClick={google}
            disabled={busy}
            className="w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:border-primary/60 hover:text-primary disabled:opacity-50"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="label-mono">or email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            ) : null}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {message ? <p className="mt-4 text-xs text-accent">{message}</p> : null}

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
