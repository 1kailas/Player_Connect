import React from "react";
import { Loader } from "lucide-react";

/**
 * Modern Loading Spinner Component
 *
 * @param {Object} props
 * @param {string} props.size - sm, md, lg, xl
 * @param {string} props.variant - primary, white, secondary
 * @param {string} props.text - Loading text
 * @param {boolean} props.fullScreen - Show as fullscreen overlay
 * @param {string} props.className - Additional classes
 */
const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  text = "",
  fullScreen = false,
  className = "",
}) => {
  // Size variants
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  // Variant colors
  const variantClasses = {
    primary: "text-primary-600 dark:text-primary-400",
    white: "text-white",
    secondary: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Loader
        className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`}
      />
      {text && (
        <p
          className={`text-sm font-medium ${variantClasses[variant]} animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
