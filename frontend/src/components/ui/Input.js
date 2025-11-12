import React, { forwardRef } from "react";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

/**
 * Modern Input Component with validation states and icons
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.success - Success message
 * @param {string} props.helperText - Helper text below input
 * @param {React.ReactNode} props.leftIcon - Icon on the left
 * @param {React.ReactNode} props.rightIcon - Icon on the right
 * @param {boolean} props.showPasswordToggle - Show password toggle for password inputs
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.size - sm, md, lg
 * @param {string} props.className - Additional classes
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      required = false,
      size = "md",
      type = "text",
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isTouched, setIsTouched] = React.useState(false);

    // Size variants
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3.5 text-base",
      lg: "px-5 py-4 text-lg",
    };

    // Icon size based on input size
    const iconSizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    // Base input classes
    const baseClasses =
      "w-full bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed";

    // State-based classes
    const getStateClasses = () => {
      if (error && isTouched) {
        return "border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30";
      }
      if (success && isTouched) {
        return "border-green-400 dark:border-green-500 focus:border-green-500 focus:ring-green-100 dark:focus:ring-green-900/30";
      }
      return "border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-100 dark:focus:ring-primary-900/30";
    };

    // Padding adjustments for icons
    const getPaddingClasses = () => {
      let classes = sizeClasses[size];
      if (leftIcon) classes += " pl-12";
      if (rightIcon || showPasswordToggle || error || success) classes += " pr-12";
      return classes;
    };

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    const handleBlur = (e) => {
      setIsTouched(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span
                className={`${iconSizeClasses[size]} transition-colors ${
                  error && isTouched
                    ? "text-red-400"
                    : success && isTouched
                      ? "text-green-500"
                      : "text-gray-400"
                }`}
              >
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={`
              ${baseClasses}
              ${getPaddingClasses()}
              ${getStateClasses()}
            `}
            onBlur={handleBlur}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
            {/* Validation Icons */}
            {isTouched && (error || success) && !showPasswordToggle && (
              <span className={iconSizeClasses[size]}>
                {error ? (
                  <AlertCircle className="text-red-500" />
                ) : (
                  <CheckCircle className="text-green-500" />
                )}
              </span>
            )}

            {/* Password Toggle */}
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className={iconSizeClasses[size]} />
                ) : (
                  <Eye className={iconSizeClasses[size]} />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !showPasswordToggle && (
              <span className={`${iconSizeClasses[size]} text-gray-400`}>
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* Helper Text / Error / Success Messages */}
        {(error || success || helperText) && (
          <div className="animate-fade-in">
            {error && isTouched && (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && isTouched && !error && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}
            {helperText && !error && !success && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
