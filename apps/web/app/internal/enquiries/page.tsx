import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { AdminAuthorizationError } from "@/lib/admin-auth";
import { getAdminEnquiries } from "@/lib/admin-enquiries";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Internal enquiries",
  robots: { index: false, follow: false, nocache: true },
};

export default async function InternalEnquiriesPage() {
  let data;
  try {
    data = await getAdminEnquiries();
  } catch (error) {
    if (error instanceof AdminAuthorizationError) notFound();
    console.error("Internal enquiry dashboard could not load:", error instanceof Error ? error.message : "Unknown error");
    return (
      <main className="grid min-h-dvh place-items-center bg-ivory px-5 text-navy">
        <section className="max-w-lg rounded-3xl border border-navy/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(23,61,49,0.1)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Internal access</p>
          <h1 className="mt-3 font-display text-4xl">The enquiry list is unavailable</h1>
          <p className="mt-4 text-sm leading-6 text-muted">
            Confirm that Google Sheets is shared with the service account and that the Enquiries tab has the required headers.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-ivory text-navy">
      <header className="border-b border-navy/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo className="h-14 w-auto" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Restricted</p>
              <p className="font-display text-xl">Internal enquiries</p>
            </div>
          </div>
          <Link href="/" className="text-sm underline decoration-gold underline-offset-4">Public site</Link>
        </div>
      </header>

      <main className="mx-auto max-w-[96rem] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Google Sheets · {data.tab}</p>
            <h1 className="mt-2 font-display text-4xl sm:text-5xl">Submitted forms</h1>
            <p className="mt-3 text-sm text-muted">
              {data.rows.length} {data.rows.length === 1 ? "enquiry" : "enquiries"}. New submissions appear at the bottom.
            </p>
          </div>
          <a href="/internal/enquiries" className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 text-sm font-semibold text-white">
            Refresh data
          </a>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-[0_18px_55px_rgba(23,61,49,0.08)]">
          {data.rows.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-[120rem] border-collapse text-left text-sm">
                <thead className="bg-navy text-white">
                  <tr>
                    <th scope="col" className="w-16 px-4 py-4 font-semibold">Row</th>
                    {data.headers.map((header) => (
                      <th scope="col" key={header} className="min-w-40 px-4 py-4 font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, rowIndex) => (
                    <tr key={`sheet-row-${rowIndex + 2}`} className="border-t border-navy/8 align-top even:bg-ivory/55">
                      <th scope="row" className="px-4 py-4 font-semibold text-muted">{rowIndex + 2}</th>
                      {row.map((value, columnIndex) => (
                        <td key={`${rowIndex}-${columnIndex}`} className="max-w-72 whitespace-pre-wrap px-4 py-4 leading-6 text-navy/85">
                          {value || <span className="text-muted/60">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-6 py-16 text-center text-muted">No submitted enquiries are in the sheet yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
