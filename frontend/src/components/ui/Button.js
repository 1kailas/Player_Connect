import React from "react";
import { Loader } from "lucide-react";

/**
 * Modern Button Component with multiple variants and sizes
 *
 * @param {Object} props
 * @param {string} props.variant - primary, secondary, success, danger, ghost, outline
 * @param {string} props.size - sm, md, lg, xl
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional classes
 */
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  type = "button",
  ...props
}) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed";

  // Size variants
  const sizeClasses = {
    sm: "px-3 py-2 text-sm gap-2",
    md: "px-4 py-3 text-base gap-2",
    lg: "px-6 py-3.5 text-lg gap-3",
    xl: "px-8 py-4 text-xl gap-3",
  };

  // Variant classes
  const variantClasses = {
    primary:
      "bg-gradient-to-r from-primary-500 via-blue-600 to-purple-600 hover:from-primary-600 hover:via-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-xl focus:ring-primary-200 dark:focus:ring-primary-900/50 transform hover:scale-[1.02] active:scale-[0.98]",
    secondary:
      "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-200 dark:focus:ring-gray-600/50",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-xl focus:ring-green-200 dark:focus:ring-green-900/50 transform hover:scale-[1.02] active:scale-[0.98]",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-xl focus:ring-red-200 dark:focus:ring-red-900/50 transform hover:scale-[1.02] active:scale-[0.98]",
    warning:
      "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md hover:shadow-xl focus:ring-yellow-200 dark:focus:ring-yellow-900/50 transform hover:scale-[1.02] active:scale-[0.98]",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-200 dark:focus:ring-gray-700/50",
    outline:
      "bg-transparent border-2 border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-200 dark:focus:ring-primary-900/50",
  };

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Loading spinner size based on button size
  const spinnerSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-7 w-7",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader className={`${spinnerSize[size]} animate-spin`} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
