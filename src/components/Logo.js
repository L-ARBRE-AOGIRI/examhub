import Link from "next/link";

export default function Logo({ clair = false, className = "" }) {
  return (
    <Link href="/" className={"group inline-flex items-center gap-2.5 " + className}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-marque-600 shadow-[0_4px_14px_-4px_rgba(0,136,67,0.7)] transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="m9 14 2 2 4-4" />
        </svg>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent-500 ring-2 ring-white"></span>
      </span>
      <span className={"titre-display text-xl " + (clair ? "text-white" : "text-encre")}>
        Exam<span className="text-accent-500">HECM</span>
      </span>
    </Link>
  );
}
