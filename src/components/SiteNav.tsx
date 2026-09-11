import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { IconBox, IconLogout } from "@/components/icons";
import { supabase } from "@/integrations/supabase/client";

const links = [{ to: "/explore/$sceneId", params: { sceneId: "cardiac" }, label: "3D Studio" }] as const;

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
    <header className="sticky top-0 z-40 border-b border-[#e4e4e7] bg-[#fafafa]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-6"
      >
        <Link to="/" className="ui-interactive font-display text-lg font-semibold tracking-tight">
          SPATIA
        </Link>
        <div className="ml-2 hidden flex-1 items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params}
              className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-sm text-[#71717a] hover:text-[#18181b]"
            >
              <IconBox className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {email ? (
            <>
              <span className="hidden max-w-[160px] truncate font-mono text-xs text-[#71717a] sm:block">
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
                className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 border border-[#e4e4e7] bg-white px-3 py-1.5 text-xs text-[#3f3f46] hover:text-[#18181b]"
                style={{ borderRadius: 6 }}
              >
                <IconLogout className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 bg-[#18181b] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#27272a]"
              style={{ borderRadius: 6 }}
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
