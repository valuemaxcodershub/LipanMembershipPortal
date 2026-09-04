import { ReactNode } from "react";

type FormQuestionCardProps = {
  number: number;
  title: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
};

export default function FormQuestionCard({
  number,
  title,
  required = true,
  hint,
  error,
  className = "",
  children,
}: FormQuestionCardProps) {
  return (
    <section className={`ms-form-card rounded-xl px-5 py-5 shadow-[0_1.6px_3.6px_rgba(0,0,0,0.13)] sm:px-6 sm:py-6 ${className}`}>
      <h3 className="text-[15px] font-semibold leading-snug text-[#242424] sm:text-base">
        <span className="mr-1.5 text-[#5b5fc7]">{number}.</span>
        {title}
        {required && <span className="ml-1 text-[#c4314b]">*</span>}
      </h3>
      {hint && <p className="mt-1 text-sm text-[#616161]">{hint}</p>}
      <div className="mt-4">{children}</div>
      {error && <p className="mt-2 text-sm text-[#c4314b]">{error}</p>}
    </section>
  );
}
