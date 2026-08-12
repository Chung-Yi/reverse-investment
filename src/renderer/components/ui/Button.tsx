import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "text";
  full?: boolean;
}

export function Button({ variant = "primary", full = false, className = "", children, ...props }: PropsWithChildren<ButtonProps>) {
  return <button className={`button ${variant} ${full ? "full" : ""} ${className}`.trim()} {...props}>{children}</button>;
}
