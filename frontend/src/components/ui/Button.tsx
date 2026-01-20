import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "secondary",
  isLoading,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    fontWeight: 500,
    cursor: disabled || isLoading ? "not-allowed" : "pointer",
    opacity: disabled || isLoading ? 0.7 : 1,
    transition: "background-color 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "#3b82f6", color: "white" },
    secondary: { backgroundColor: "#e5e7eb", color: "#1f2937" },
    danger: { backgroundColor: "#ef4444", color: "white" },
    ghost: { backgroundColor: "transparent", color: "#4b5563" },
  };

  return (
    <button
      style={{ ...baseStyle, ...variantStyles[variant] }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="spinner">⏳</span>}
      {children}
    </button>
  );
};
