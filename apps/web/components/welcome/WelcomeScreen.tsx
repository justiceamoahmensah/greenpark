import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, MousePointerClick, Send } from "lucide-react";
import type { Development, PublicConfig } from "@/lib/types";

export function WelcomeScreen({
  config,
  development,
  invalidDevelopment,
  startHref,
}: {
  config: PublicConfig;
  development: Development | null;
  invalidDevelopment: boolean;
  startHref: string;
}) {
  const image = development?.image_url || "/developments/haven-gardens-hero.webp";
  const eyebrow = development ? "Development enquiry" : "Private property enquiry";
  const intro = development
    ? development.description
    : "Tell us what you are looking for and our team will follow up with property options that suit your needs.";

  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-4 sm:px-8 md:min-h-[660px] md:grid-cols-[0.88fr_1.12fr] md:items-center md:gap-12 md:pb-20">
        <div className="relative z-10 py-8 md:py-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-white/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-navy backdrop-blur">
            <span className="size-1.5 rounded-full bg-gold" /> {eyebrow}
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(3.4rem,7vw,6.9rem)] leading-[0.86] tracking-[-0.045em] text-navy">
            Your Next Home <span className="italic text-gold">Begins Here</span>
          </h1>
          {development ? <h2 className="mt-6 font-display text-2xl text-navy">Exploring {development.name}</h2> : null}
          <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">{intro}</p>

          {invalidDevelopment ? (
            <p className="mt-4 rounded-xl border border-gold/40 bg-white/70 px-4 py-3 text-sm text-navy" role="status">
              That development link is not active. You can still use the general enquiry.
            </p>
          ) : null}

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={startHref} className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(16,43,70,0.2)] transition hover:-translate-y-0.5 hover:bg-royal">
              Start My Enquiry <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            {config.whatsapp_url ? (
              <a href={config.whatsapp_url} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 text-sm font-semibold text-navy transition hover:border-gold hover:bg-ivory">
                <MessageCircle className="size-4" aria-hidden="true" /> Chat With Sales
              </a>
            ) : (
              <span className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-navy/10 bg-white/60 px-6 py-3 text-sm text-muted" title="Add WHATSAPP_E164 to enable WhatsApp">
                <MessageCircle className="size-4" aria-hidden="true" /> Chat With Sales
              </span>
            )}
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs text-muted">
            <CheckCircle2 className="size-4 text-gold" aria-hidden="true" /> It only takes a few minutes to complete.
          </p>
        </div>

        <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] bg-navy shadow-[0_30px_80px_rgba(16,43,70,0.22)] md:min-h-[600px]">
          <Image
            src={image}
            alt={development ? `${development.name} development` : "Haven Gardens development in Adjiringanor"}
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
        </div>
      </section>

      <section className="border-y border-navy/8 bg-white/65" aria-labelledby="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-gold">Simple and considered</p>
          <h2 id="how-it-works" className="mx-auto mt-3 max-w-xl text-center font-display text-4xl sm:text-5xl">How it works</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: MousePointerClick, number: "01", title: "Tell us what fits", copy: "Answer twelve short questions, one at a time, with the freedom to go back." },
              { icon: CheckCircle2, number: "02", title: "Review every detail", copy: "Check and edit your answers before anything is sent to the property team." },
              { icon: Send, number: "03", title: "Send your enquiry", copy: "Once submitted, our team receives your enquiry and will follow up with you." },
            ].map(({ icon: Icon, number, title, copy }) => (
              <article key={number} className="group rounded-3xl border border-navy/8 bg-white p-6 shadow-[0_12px_35px_rgba(16,43,70,0.05)] transition hover:-translate-y-1 hover:border-gold/50">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-navy text-white"><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="font-display text-3xl text-gold/70">{number}</span>
                </div>
                <h3 className="mt-6 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
