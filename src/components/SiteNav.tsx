import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { IconBox, IconLogout } from "@/components/icons";
import { supabase } from "@/integrations/supabase/client";

const links = [{ to: "/explore/$sceneId", params: { sceneId: "cardiac" }, label: "3D STUDIO" }] as const;

export function SiteNav() {
  const [email, setEmail] = useState<string | null>(null);

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
    <header className="sticky top-0 z-40 border-b-2 border-[#2a2a2a] bg-[#0a0a0a]">
      <nav
        aria-label="Primary"
        className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-3 md:grid-cols-[auto_1fr_auto] md:px-6"
      >
        <Link
          to="/"
          className="ui-interactive font-display text-xl font-black tracking-tight text-[#eaeaea]"
        >
          SPATIA<span className="text-[#e61919]">®</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params}
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 font-mono text-xs tracking-[0.1em] text-[#9a9a9a] uppercase hover:text-[#eaeaea]"
            >
              <span aria-hidden className="text-[#e61919]">
                +
              </span>
              <IconBox className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 hidden font-mono text-[10px] tracking-[0.1em] text-[#9a9a9a] uppercase lg:block">
            REV 2.6
          </span>
          {email ? (
            <>
              <span className="hidden max-w-[160px] truncate font-mono text-xs text-[#9a9a9a] sm:block">
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
                className="ui-interactive inline-flex cursor-pointer items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-3 py-1.5 font-mono text-xs tracking-[0.1em] text-[#eaeaea] uppercase hover:border-[#e61919]"
              >
                <IconLogout className="h-4 w-4" /> SIGN OUT
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ui-interactive inline-flex cursor-pointer items-center gap-2 bg-[#e61919] px-4 py-1.5 font-mono text-xs font-bold tracking-[0.1em] text-white uppercase hover:bg-[#ff2a2a]"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
