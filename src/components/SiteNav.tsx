import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { IconBox, IconLogout } from "@/components/icons";
import { supabase } from "@/integrations/supabase/client";

const links = [{ to: "/explore/$sceneId", params: { sceneId: "cardiac" }, label: "3D Studio" }] as const;

export function SiteNav() {
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (alive) setEmail(data.session?.user.email ?? null);
      } catch {
        // Supabase is optional (demo mode ships without keys), so stay signed out.
        if (alive) setEmail(null);
      }
      try {
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
          if (alive) setEmail(session?.user.email ?? null);
        });
        unsubscribe = () => sub.subscription.unsubscribe();
      } catch {
        // No Supabase endpoint configured, so there is no session subscription.
      }
    })();
    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <nav
          aria-label="Primary"
          className="flex h-16 w-max max-w-full items-center gap-2 border border-white/10 bg-black/60 px-3 shadow-[0_18px_60px_rgb(0_0_0/0.5)] backdrop-blur-2xl"
          style={{ borderRadius: 9999 }}
        >
          <Link
            to="/"
            className="ui-interactive px-3 font-display text-lg font-semibold tracking-tight text-zinc-100"
          >
            SPATIA
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                params={l.params}
                className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-zinc-100"
              >
                <IconBox className="h-4 w-4" />
                {l.label}
              </Link>
            ))}
          </div>
          <div className="ml-1 flex items-center gap-2">
            {email ? (
              <>
                <span className="hidden max-w-[160px] truncate font-mono text-xs text-zinc-400 sm:block">
                  {email}
                </span>
                <button
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                    } catch {
                      setEmail(null);
                    }
                  }}
                  className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <IconLogout className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="ui-interactive group inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-400 py-1.5 pr-1.5 pl-4 text-xs font-semibold text-emerald-950 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-emerald-300 active:scale-[0.98]"
              >
                Sign in
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:scale-105">
                  <IconBox className="h-4 w-4" />
                </span>
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-current transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0 rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`absolute h-px w-4 bg-current transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? "translate-y-0 -rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </nav>
      </header>
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-3xl md:hidden"
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex min-h-[100dvh] flex-col justify-center gap-2 px-8">
            {links.map((l, i) => (
              <Link
                key={l.label}
                to={l.to}
                params={l.params}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${100 + i * 50}ms` }}
                className="translate-y-12 animate-reveal text-4xl font-bold tracking-tight text-zinc-100 opacity-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 -z-10"
          />
        </div>
      ) : null}
    </>
  );
}
