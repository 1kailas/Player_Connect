import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  Trophy,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const validateField = (name, value) => {
    switch (name) {
      case "usernameOrEmail":
        if (!value.trim()) {
          return "Username or email is required";
        }
        if (value.length < 3) {
          return "Must be at least 3 characters";
        }
        return "";

      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "rememberMe") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      usernameOrEmail: true,
      password: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const success = await login({
        usernameOrEmail: formData.usernameOrEmail.trim(),
        password: formData.password,
      });

      if (success) {
        toast.success("Welcome back! 🎉", {
          duration: 3000,
          icon: "👋",
        });

        // Small delay for better UX
        setTimeout(() => {
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 rounded-xl transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4";

    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30`;
    }

    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-400 dark:border-green-500 focus:border-green-500 focus:ring-green-100 dark:focus:ring-green-900/30`;
    }

    return `${baseClass} border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-100 dark:focus:ring-primary-900/30`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl blur-lg opacity-60 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-primary-500 via-blue-600 to-purple-600 p-4 rounded-2xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Trophy className="h-12 w-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 dark:from-primary-400 dark:via-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
              Welcome Back
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
            Sign in to continue your sports journey
          </p>

          {/* Registration Link */}
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors inline-flex items-center gap-1 group"
            >
              Create one now
              <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Username/Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="usernameOrEmail"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail
                    className={`h-5 w-5 transition-colors ${
                      errors.usernameOrEmail && touched.usernameOrEmail
                        ? "text-red-400"
                        : touched.usernameOrEmail && formData.usernameOrEmail
                          ? "text-green-500"
                          : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="usernameOrEmail"
                  name="usernameOrEmail"
                  type="text"
                  autoComplete="username"
                  className={`${getInputClassName("usernameOrEmail")} pl-12 pr-12`}
                  placeholder="Enter your username or email"
                  value={formData.usernameOrEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {/* Validation Icons */}
                {touched.usernameOrEmail && formData.usernameOrEmail && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {errors.usernameOrEmail ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {/* Error Message */}
              {errors.usernameOrEmail && touched.usernameOrEmail && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.usernameOrEmail}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock
                    className={`h-5 w-5 transition-colors ${
                      errors.password && touched.password
                        ? "text-red-400"
                        : touched.password && formData.password
                          ? "text-green-500"
                          : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`${getInputClassName("password")} pl-12 pr-12`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                />
                {/* Show/Hide Password Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {/* Error Message */}
              {errors.password && touched.password && (
                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer transition-colors"
                  disabled={loading}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 via-blue-600 to-purple-600 hover:from-primary-600 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 font-medium">
                  Demo Credentials
                </span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Admin Account
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span> admin@sports.com
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Password:</span> admin123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <button className="text-primary-600 dark:text-primary-400 hover:underline">
            Terms of Service
          </button>{" "}
          and{" "}
          <button className="text-primary-600 dark:text-primary-400 hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
