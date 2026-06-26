import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "main";
  narrow?: boolean;
}

export function Container({ as: Tag = "div", narrow, className = "", children, ...props }: ContainerProps) {
  return (
    <Tag
      className={`mx-auto px-6 w-full ${narrow ? "max-w-3xl" : "max-w-[1320px]"} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  surface?: boolean;
}

export function Section({ id, surface, className = "", children, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-24 ${surface ? "bg-surface-1/60 backdrop-blur-sm" : ""} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
