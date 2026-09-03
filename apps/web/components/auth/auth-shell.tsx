"use client";

interface AuthShellProps {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 sm:py-14">
      <div aria-hidden className="absolute inset-0 bg-[#e0d0c1] dark:bg-[#2f201c]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(167,109,96,0.35),transparent_55%),radial-gradient(ellipse_at_15%_15%,rgba(247,241,234,0.7),transparent_42%),radial-gradient(ellipse_at_90%_90%,rgba(167,109,96,0.22),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_70%_40%,rgba(167,109,96,0.45),transparent_55%),radial-gradient(ellipse_at_20%_20%,rgba(224,208,193,0.12),transparent_45%),radial-gradient(ellipse_at_85%_85%,rgba(196,139,125,0.18),transparent_40%)]"
      />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-[2rem] border border-[#a76d60]/25 bg-[#f7f1ea] px-7 py-10 text-[#2f201c] shadow-[0_30px_80px_-28px_rgba(47,32,28,0.35)] dark:border-[#e0d0c1]/20 dark:bg-[#46312b] dark:text-[#e0d0c1] dark:shadow-[0_30px_80px_-28px_rgba(0,0,0,0.55)] sm:px-10 sm:py-12">
          <div className="mb-8 space-y-3 text-center">
            <h1 className="text-[1.65rem] leading-tight font-semibold tracking-tight text-[#2f201c] dark:text-[#e0d0c1] sm:text-[1.85rem]">
              {title}
            </h1>
            <p className="mx-auto max-w-[320px] text-[0.925rem] leading-relaxed text-[#6b4e47] dark:text-[#c9b5a3]">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
