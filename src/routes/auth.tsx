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
        <p className="font-mono text-[10px] tracking-[0.1em] text-[#e61919] uppercase">[ AUTH /// UNIT-A01 ]</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9] font-black uppercase">{mode === "signin" ? "WELCOME BACK" : "START STUDY LOG"}</h1>
        <p className="mt-4 max-w-[65ch] font-mono text-xs leading-relaxed tracking-[0.05em] text-[#9a9a9a] uppercase">
          PROGRESS TRACKER /// FLASHCARD DECKS /// FOCUS SESSIONS FOLLOW THIS ACCOUNT.
        </p>

        <div className="mt-8 border-2 border-[#2a2a2a] bg-[#111111] p-6">
          <button
            onClick={google}
            disabled={busy}
            className="w-full border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2.5 font-mono text-xs font-bold tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919] disabled:opacity-50"
            
          >
            CONTINUE WITH GOOGLE
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-[#2a2a2a]" />
            <span className="font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">[ OR EMAIL ]</span>
            <span className="h-px flex-1 bg-[#2a2a2a]" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" ? (
              <div className="space-y-2">
                <label htmlFor="auth-name" className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#eaeaea] uppercase">YOUR NAME</label>
                <input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  autoComplete="name"
                  className="w-full border border-[#2a2a2a] bg-[#0a0a0a]/60 px-3 py-2.5 text-sm text-[#eaeaea] outline-none placeholder:text-[#9a9a9a] focus:border-[#e61919]"
                  
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <label htmlFor="auth-email" className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#eaeaea] uppercase">EMAIL</label>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                autoComplete="email"
                className="w-full border border-[#2a2a2a] bg-[#0a0a0a]/60 px-3 py-2.5 text-sm text-[#eaeaea] outline-none placeholder:text-[#9a9a9a] focus:border-[#e61919]"
                
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="auth-password" className="font-mono text-[10px] font-bold tracking-[0.1em] text-[#eaeaea] uppercase">PASSWORD</label>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className="w-full border border-[#2a2a2a] bg-[#0a0a0a]/60 px-3 py-2.5 text-sm text-[#eaeaea] outline-none placeholder:text-[#9a9a9a] focus:border-[#e61919]"
                
              />
              <p className="font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase">MIN 6 CHARACTERS.</p>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#e61919] px-4 py-2.5 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a] disabled:opacity-50"
              
            >
              {busy ? "WORKING…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          {message ? (
            <p role={message.includes("inbox") ? "status" : "alert"} className="mt-4 border border-[#2a2a2a] bg-[#0a0a0a] px-3 py-2 font-mono text-xs leading-relaxed text-[#eaeaea]" >{message}</p>
          ) : null}

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-5 w-full text-center font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase hover:text-[#eaeaea]"
          >
            {mode === "signin" ? "NEW HERE? /// CREATE AN ACCOUNT" : "HAVE AN ACCOUNT? /// SIGN IN"}
          </button>
        </div>
      </section>
    </main>
  );
}
