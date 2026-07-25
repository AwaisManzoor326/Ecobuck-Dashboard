import React from "react";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none hover:scale-[1.02] active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-[#299738] hover:bg-[#1A3B24] text-white shadow-sm focus:ring-[#299738]",
    secondary:
      "bg-white dark:bg-[#163320] hover:bg-[#E8F8EE] dark:hover:bg-[#1A3B24] text-[var(--text-primary)] border border-[#E5EAE5] dark:border-[#243B2A] focus:ring-[#299738]",
    outline:
      "bg-white/80 dark:bg-[#163320]/80 border border-[#E5EAE5] dark:border-[#243B2A] hover:border-[#299738] text-[var(--text-primary)] focus:ring-[#299738]",
    ghost:
      "hover:bg-[#E8F8EE] dark:hover:bg-[#163320] text-[var(--text-secondary)] hover:text-[#299738] dark:hover:text-[#25D366] focus:ring-[#299738]",
    danger:
      "bg-[var(--danger)] hover:opacity-90 text-white shadow-sm focus:ring-[var(--danger)]",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5 min-h-[32px]",
    md: "px-4 py-2 text-sm gap-2 min-h-[40px]",
    lg: "px-5 py-2.5 text-base gap-2.5 min-h-[48px]",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
