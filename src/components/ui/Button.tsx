import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#168447] text-white hover:bg-[#106b38] shadow-sm",
  secondary: "border border-[#dfe5dc] bg-white text-[#253128] hover:bg-[#f5f7f3]",
  ghost: "bg-transparent text-[#68736a] hover:bg-[#f0f3ee]",
  danger: "bg-[#fff0ed] text-[#b74432] hover:bg-[#ffe3dc]",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}