import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ivory px-5 text-center text-navy">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Page not found</p>
        <h1 className="mt-3 font-display text-6xl">Let&apos;s find the right path</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">The page or development link you opened is unavailable.</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white">Return home</Link>
      </div>
    </main>
  );
}
