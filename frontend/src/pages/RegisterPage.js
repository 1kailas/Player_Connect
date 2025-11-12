import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader,
  User,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Sparkles,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    country: "",
    city: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) {
          return "Username is required";
        }
        if (value.length < 3) {
          return "Username must be at least 3 characters";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          return "Username can only contain letters, numbers, and underscores";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";

      case "password":
        if (!value) {
          return "Password is required";
        }
        if (value.length < 6) {
          return "Password must be at least 6 characters";
        }
        if (!/(?=.*[a-z])/.test(value)) {
          return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(value)) {
          return "Password must contain at least one number";
        }
        return "";

      case "confirmPassword":
        if (!value) {
          return "Please confirm your password";
        }
        if (value !== formData.password) {
          return "Passwords do not match";
        }
        return "";

      case "firstName":
        if (!value.trim()) {
          return "First name is required";
        }
        if (value.length < 2) {
          return "First name must be at least 2 characters";
        }
        return "";

      case "lastName":
        if (!value.trim()) {
          return "Last name is required";
        }
        if (value.length < 2) {
          return "Last name must be at least 2 characters";
        }
        return "";

      case "phoneNumber":
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (!/^\+?[\d\s-()]+$/.test(value)) {
          return "Please enter a valid phone number";
        }
        return "";

      case "country":
        if (!value.trim()) {
          return "Country is required";
        }
        return "";

      case "city":
        if (!value.trim()) {
          return "City is required";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // Also validate confirmPassword when password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword,
      );
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
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

  const validateStep = (step) => {
    const fieldsToValidate = getStepFields(step);
    const newErrors = {};
    const newTouched = {};

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
      newTouched[field] = true;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...newTouched }));

    return Object.keys(newErrors).length === 0;
  };

  const getStepFields = (step) => {
    switch (step) {
      case 1:
        return ["username", "email"];
      case 2:
        return ["password", "confirmPassword"];
      case 3:
        return ["firstName", "lastName", "phoneNumber", "country", "city"];
      default:
        return [];
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fix the errors before continuing");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;

      // Trim all string values
      const cleanedData = Object.keys(registerData).reduce((acc, key) => {
        acc[key] =
          typeof registerData[key] === "string"
            ? registerData[key].trim()
            : registerData[key];
        return acc;
      }, {});

      const success = await register(cleanedData);

      if (success) {
        toast.success("Registration successful! Welcome aboard! 🎉", {
          duration: 3000,
          icon: "🎊",
        });

        // Small delay for better UX
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error("Registration error:", error);
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return {
      strength,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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

      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-fade-in-up">
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
              Create Your Account
            </span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
            Join thousands of athletes in the ultimate sports platform
          </p>

          {/* Login Link */}
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors inline-flex items-center gap-1 group"
            >
              Sign in here
              <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
            </Link>
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 sm:p-10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep > step
                          ? "bg-green-500 border-green-500 text-white"
                          : currentStep === step
                            ? "bg-primary-500 border-primary-500 text-white scale-110 shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400"
                      }`}
                    >
                      {currentStep > step ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">{step}</span>
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        currentStep >= step
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step === 1 && "Account"}
                      {step === 2 && "Security"}
                      {step === 3 && "Profile"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className="flex-1 h-0.5 mx-2 mb-6">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          currentStep > step
                            ? "bg-green-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      ></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                {/* Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User
                        className={`h-5 w-5 transition-colors ${
                          errors.username && touched.username
                            ? "text-red-400"
                            : touched.username && formData.username
                              ? "text-green-500"
                              : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      className={`${getInputClassName("username")} pl-12 pr-12`}
                      placeholder="Choose a unique username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
                    {touched.username && formData.username && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {errors.username ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.username && touched.username && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.username}</span>
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        className={`h-5 w-5 transition-colors ${
                          errors.email && touched.email
                            ? "text-red-400"
                            : touched.email && formData.email
                              ? "text-green-500"
                              : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`${getInputClassName("email")} pl-12 pr-12`}
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
                    {touched.email && formData.email && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {errors.email ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Password */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
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
                      autoComplete="new-password"
                      className={`${getInputClassName("password")} pl-12 pr-12`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          ></div>
                        ))}
                      </div>
                      {passwordStrength.label && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Password strength:{" "}
                          <span className="font-semibold">
                            {passwordStrength.label}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  {errors.password && touched.password && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        className={`h-5 w-5 transition-colors ${
                          errors.confirmPassword && touched.confirmPassword
                            ? "text-red-400"
                            : touched.confirmPassword &&
                                formData.confirmPassword
                              ? "text-green-500"
                              : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={`${getInputClassName("confirmPassword")} pl-12 pr-12`}
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        className={getInputClassName("firstName")}
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                      />
                      {touched.firstName && formData.firstName && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          {errors.firstName ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.firstName && touched.firstName && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.firstName}</span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        className={getInputClassName("lastName")}
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                      />
                      {touched.lastName && formData.lastName && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          {errors.lastName ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.lastName && touched.lastName && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      className={`${getInputClassName("phoneNumber")} pl-12 pr-12`}
                      placeholder="+1 (555) 000-0000"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                    />
                    {touched.phoneNumber && formData.phoneNumber && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        {errors.phoneNumber ? (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Country */}
                  <div className="space-y-2">
                    <label
                      htmlFor="country"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Country
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        autoComplete="country-name"
                        className={`${getInputClassName("country")} pl-12 pr-12`}
                        placeholder="United States"
                        value={formData.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                      />
                      {touched.country && formData.country && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          {errors.country ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.country && touched.country && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.country}</span>
                      </div>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        className={`${getInputClassName("city")} pl-12 pr-12`}
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={loading}
                      />
                      {touched.city && formData.city && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                          {errors.city ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.city && touched.city && (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 via-blue-600 to-purple-600 hover:from-primary-600 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 via-blue-600 to-purple-600 hover:from-primary-600 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{" "}
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

export default RegisterPage;
