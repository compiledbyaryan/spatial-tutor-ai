import { Link } from "@tanstack/react-router";
import { Boxes, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/explore/$sceneId", params: { sceneId: "cardiac" }, label: "3D Studio", icon: Boxes },
] as const;

export function SiteNav() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-6xl px-4 md:px-6">
      <nav
        aria-label="Primary"
        className="panel flex items-center gap-3 px-4 py-2.5"
      >
        <Link to="/" className="font-display text-base font-bold tracking-tight">
          SPATIA
        </Link>
        <div className="ml-2 hidden flex-1 items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              params={l.params}
              className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {email ? (
            <>
              <span className="label-mono hidden max-w-[160px] truncate sm:block">{email}</span>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
                className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ui-interactive inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
