import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteChrome({
  companyName,
  children,
  email,
  phone,
  website,
  compact = false,
}: {
  companyName: string;
  children: React.ReactNode;
  email?: string;
  phone?: string;
  website?: string;
  compact?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-ivory text-navy">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className={`mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-8 ${compact ? "py-4" : "py-5"}`}>
        <Link href="/" className="flex items-center">
          <Logo className={compact ? "h-14 w-auto" : "h-16 w-auto sm:h-20"} />
          <span className="sr-only">{companyName}</span>
        </Link>
        <Link href="/enquire" className="hidden text-sm font-medium text-navy/75 underline decoration-gold underline-offset-4 sm:block">
          Start an enquiry
        </Link>
      </header>
      <main id="main">{children}</main>
      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-10 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {website ? (
            <a href={website} target="_blank" rel="noreferrer" className="underline decoration-gold underline-offset-4">
              {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          ) : null}
          {email ? <a href={`mailto:${email}`}>{email}</a> : null}
          {phone ? <span>{phone}</span> : null}
        </div>
        <Link href="/privacy" className="underline decoration-gold underline-offset-4">
          Privacy policy
        </Link>
      </footer>
    </div>
  );
}
