import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data.data;

      // Convert roles Set to Array if needed
      if (userData.roles) {
        userData.roles = Array.isArray(userData.roles)
          ? userData.roles
          : Array.from(userData.roles);
      }

      setUser(userData);
      console.log("User loaded successfully:", userData.username);
    } catch (error) {
      console.error("Failed to load user:", error);

      // Only clear credentials if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);

        // Don't show error toast on initial load
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          toast.error("Session expired. Please login again.");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (credentials) => {
    try {
      // Validate credentials before sending
      if (!credentials.usernameOrEmail?.trim() || !credentials.password) {
        toast.error("Please enter both username/email and password");
        return false;
      }

      const response = await authAPI.login(credentials);

      // Check if response has the expected structure
      if (!response?.data?.data) {
        throw new Error("Invalid response from server");
      }

      const { token, userId, username, email, roles } = response.data.data;

      // Validate required fields
      if (!token || !userId) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      setToken(token);

      // Convert roles Set to Array if needed
      const rolesArray = Array.isArray(roles) ? roles : Array.from(roles || []);
      setUser({ id: userId, username, email, roles: rolesArray });

      console.log("Login successful for user:", username);
      return true;
    } catch (error) {
      console.error("Login error:", error);

      // Enhanced error messages
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message;

        if (status === 401 || status === 403) {
          errorMessage = "Invalid username/email or password";
        } else if (status === 404) {
          errorMessage = "Account not found";
        } else if (status === 423) {
          errorMessage = "Account is locked. Please contact support.";
        } else if (message) {
          errorMessage = message;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast.error(errorMessage);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // Validate required fields
      const requiredFields = [
        "username",
        "email",
        "password",
        "firstName",
        "lastName",
      ];
      const missingFields = requiredFields.filter(
        (field) => !userData[field]?.trim(),
      );

      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields");
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }

      const response = await authAPI.register(userData);

      // Check if response has the expected structure
      if (!response?.data?.data) {
        throw new Error("Invalid response from server");
      }

      const { token, userId, username, email, roles } = response.data.data;

      // Validate required fields
      if (!token || !userId) {
        throw new Error("Invalid registration response");
      }

      localStorage.setItem("token", token);
      setToken(token);

      // Convert roles Set to Array if needed
      const rolesArray = Array.isArray(roles) ? roles : Array.from(roles || []);
      setUser({ id: userId, username, email, roles: rolesArray });

      console.log("Registration successful for user:", username);
      return true;
    } catch (error) {
      console.error("Registration error:", error);

      // Enhanced error messages
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;

        if (
          status === 409 ||
          message?.toLowerCase().includes("already exists")
        ) {
          if (message?.toLowerCase().includes("username")) {
            errorMessage = "Username already exists. Please choose another.";
          } else if (message?.toLowerCase().includes("email")) {
            errorMessage =
              "Email already exists. Please use another email or login.";
          } else {
            errorMessage = "Account already exists. Please login instead.";
          }
        } else if (status === 400) {
          errorMessage =
            message || "Invalid registration data. Please check your inputs.";
        } else if (message) {
          errorMessage = message;
        }
      } else if (error.request) {
        errorMessage =
          "Cannot connect to server. Please check your connection.";
      }

      toast.error(errorMessage);
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      console.log("User logged out successfully");
      toast.success("Logged out successfully", {
        icon: "👋",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error during logout");
    }
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
