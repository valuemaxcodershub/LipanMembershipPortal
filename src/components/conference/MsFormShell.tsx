import { ReactNode } from "react";
import { CONFERENCE_COPY } from "../../data/conference2026";

type MsFormShellProps = {
  children: ReactNode;
  badge?: string;
};

export default function MsFormShell({
  children,
  badge = "Conference Registration",
}: MsFormShellProps) {
  return (
    <div className="ms-form-page min-h-screen pb-16 pt-28 font-[Segoe_UI,Candara,Calibri,sans-serif]">
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4">
        <article className="ms-form-header overflow-hidden rounded-xl shadow-[0_1.6px_3.6px_rgba(0,0,0,0.18)]">
          <div className="h-2 bg-[#4f52b3]" />
          <div className="min-h-[168px] border-b border-white/50 px-5 py-8 sm:min-h-[200px] sm:px-8 sm:py-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f52b3]">
              {badge}
            </p>
            <h1 className="text-2xl font-bold leading-tight text-[#1b1b1b] sm:text-[1.85rem]">
              {CONFERENCE_COPY.title}
            </h1>
            <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#2d2d2d] sm:text-base">
              {CONFERENCE_COPY.subtitle}
            </p>
            <p className="mt-3 text-sm text-[#3d3d3d]">
              {CONFERENCE_COPY.description}
            </p>
            <p className="mt-4 text-sm text-[#c4314b]">* Required</p>
          </div>
        </article>

        <div className="mt-3 space-y-3">{children}</div>
      </div>
    </div>
  );
}
