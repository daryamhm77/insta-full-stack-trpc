"use client";

interface AuthShellProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="auth-jobsly relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden
        className="absolute inset-0 bg-[#e8f2fb]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(255,186,140,0.55),transparent_52%),radial-gradient(ellipse_at_20%_20%,rgba(186,220,255,0.65),transparent_45%),radial-gradient(ellipse_at_85%_85%,rgba(255,210,230,0.35),transparent_40%)]"
      />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-[2rem] border border-white/70 bg-white px-7 py-10 text-zinc-900 shadow-[0_30px_80px_-28px_rgba(40,70,120,0.35)] sm:px-10 sm:py-12">
          <div className="mb-8 space-y-3 text-center">
            <h1 className="text-[1.65rem] leading-tight font-semibold tracking-tight text-zinc-900 sm:text-[1.85rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-[320px] text-[0.925rem] leading-relaxed text-zinc-500">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
