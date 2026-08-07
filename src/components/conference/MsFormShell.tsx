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
    <div className="ms-form-page min-h-screen bg-[#f4f4f8] pb-16 pt-28 font-[Segoe_UI,Candara,Calibri,sans-serif]">
      <div className="mx-auto w-full max-w-[720px] px-3 sm:px-4">
        <article className="overflow-hidden rounded-xl bg-white shadow-[0_1.6px_3.6px_rgba(0,0,0,0.13),0_0.3px_0.9px_rgba(0,0,0,0.11)]">
          <div className="h-3 bg-gradient-to-r from-[#5b5fc7] via-[#7f85f5] to-[#5b5fc7]" />
          <div className="border-b border-[#ebebeb] px-5 py-7 sm:px-8 sm:py-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#5b5fc7]">
              {badge}
            </p>
            <h1 className="text-2xl font-bold leading-tight text-[#242424] sm:text-[1.85rem]">
              {CONFERENCE_COPY.title}
            </h1>
            <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#424242] sm:text-base">
              {CONFERENCE_COPY.subtitle}
            </p>
            <p className="mt-3 text-sm text-[#616161]">
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
