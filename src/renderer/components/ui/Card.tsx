import type { HTMLAttributes, PropsWithChildren } from "react";

export function Card({ className = "", children, ...props }: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return <article className={`card ${className}`.trim()} {...props}>{children}</article>;
}
