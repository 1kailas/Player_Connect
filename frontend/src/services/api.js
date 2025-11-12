import axios from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      );
    }

    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data,
      );
    }
    return response;
  },
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", error.response || error.message);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message;

      switch (status) {
        case 401:
          // Unauthorized - clear credentials and redirect to login
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/register") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Session expired. Please login again.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
          break;

        case 403:
          // Forbidden
          toast.error("You do not have permission to perform this action.");
          break;

        case 404:
          // Not found
          if (!error.config.url?.includes("/auth/me")) {
            toast.error(message || "Resource not found.");
          }
          break;

        case 409:
          // Conflict (usually duplicate data)
          toast.error(message || "This data already exists.");
          break;

        case 422:
          // Validation error
          toast.error(message || "Please check your input and try again.");
          break;

        case 429:
          // Too many requests
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error("Server error. Please try again later.");
          break;

        default:
          if (message && !error.config.url?.includes("/auth/login")) {
            toast.error(message);
          }
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error(
        "Cannot connect to server. Please check your internet connection.",
      );
    } else {
      // Something else happened
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    try {
      return await api.post("/api/auth/login", credentials);
    } catch (error) {
      console.error("Login API Error:", error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      return await api.post("/api/auth/register", userData);
    } catch (error) {
      console.error("Register API Error:", error);
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      return await api.get("/api/auth/me");
    } catch (error) {
      // Don't log error for getCurrentUser as it's called on every page load
      throw error;
    }
  },
};

// Events API
export const eventsAPI = {
  getAll: (params) => api.get("/api/events", { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (eventData) => api.post("/api/events", eventData),
  update: (id, eventData) => api.put(`/api/events/${id}`, eventData),
  delete: (id) => api.delete(`/api/events/${id}`),
  register: (id) => api.post(`/api/events/${id}/register`),
  getUpcoming: () => api.get("/api/events/upcoming"),
  getLive: () => api.get("/api/events/live"),
  search: (query, params) =>
    api.get("/api/events/search", { params: { query, ...params } }),
};

// Matches API
export const matchesAPI = {
  getAll: (params) => api.get("/api/matches", { params }),
  getById: (id) => api.get(`/api/matches/${id}`),
  create: (matchData) => api.post("/api/matches", matchData),
  updateScore: (id, team1Score, team2Score) =>
    api.patch(`/api/matches/${id}/score`, null, {
      params: { team1Score, team2Score },
    }),
  start: (id) => api.post(`/api/matches/${id}/start`),
  complete: (id) => api.post(`/api/matches/${id}/complete`),
  getLive: () => api.get("/api/matches/live"),
  getUpcoming: () => api.get("/api/matches/upcoming"),
  getByEvent: (eventId, params) =>
    api.get(`/api/matches/event/${eventId}`, { params }),
  getByTeam: (teamId) => api.get(`/api/matches/team/${teamId}`),
};

// Rankings API
export const rankingsAPI = {
  getLatest: (sportType, rankingType) =>
    api.get(`/api/rankings/${sportType}/${rankingType}`),
  getPlayerHistory: (playerProfileId) =>
    api.get(`/api/rankings/player/${playerProfileId}/history`),
  getTeamHistory: (teamId) => api.get(`/api/rankings/team/${teamId}/history`),
};

// Teams API
export const teamsAPI = {
  getAll: (params) => api.get("/api/teams", { params }),
  getById: (id) => api.get(`/api/teams/${id}`),
  create: (teamData) => api.post("/api/teams", teamData),
  update: (id, teamData) => api.put(`/api/teams/${id}`, teamData),
  delete: (id) => api.delete(`/api/teams/${id}`),
  search: (sportType, query, params) =>
    api.get("/api/teams/search", { params: { sportType, query, ...params } }),
};

// News API
export const newsAPI = {
  getAll: (params) => api.get("/api/news", { params }),
  getById: (id) => api.get(`/api/news/${id}`),
  create: (articleData) => api.post("/api/news", articleData),
  update: (id, articleData) => api.put(`/api/news/${id}`, articleData),
  delete: (id) => api.delete(`/api/news/${id}`),
  publish: (id) => api.post(`/api/news/${id}/publish`),
  getLatest: (params) => api.get("/api/news/latest", { params }),
  getFeatured: () => api.get("/api/news/featured"),
  getBySport: (sportType, params) =>
    api.get(`/api/news/sport/${sportType}`, { params }),
  getByCategory: (category, params) =>
    api.get(`/api/news/category/${category}`, { params }),
  search: (query, params) =>
    api.get("/api/news/search", { params: { query, ...params } }),
};

// Venues API
export const venuesAPI = {
  getAll: (params) => api.get("/api/venues", { params }),
  getById: (id) => api.get(`/api/venues/${id}`),
  create: (venueData) => api.post("/api/venues", venueData),
  update: (id, venueData) => api.put(`/api/venues/${id}`, venueData),
  search: (query, params) =>
    api.get("/api/venues/search", { params: { query, ...params } }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params) => api.get("/api/notifications", { params }),
  getUnread: () => api.get("/api/notifications/unread"),
  markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/api/notifications/read-all"),
};

// Users API
export const userAPI = {
  getMe: () => api.get("/api/users/me"),
  getUserById: (id) => api.get(`/api/users/${id}`),
  updateProfile: (updates) => api.put("/api/users/me", updates),
  changePassword: (passwords) => api.put("/api/users/me/password", passwords),
  getStats: () => api.get("/api/users/me/stats"),
  search: (query) => api.get("/api/users/search", { params: { query } }),
};

// Files API
export const filesAPI = {
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/files/upload/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadEventImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/files/upload/event-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadNewsImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/files/upload/news-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteFile: (filename) => api.delete(`/api/files/${filename}`),
};

// Event Requests API
export const eventRequestsAPI = {
  submit: (requestData) => api.post("/api/event-requests", requestData),
  getMyRequests: (params) =>
    api.get("/api/event-requests/my-requests", { params }),
  getPending: (params) => api.get("/api/event-requests/pending", { params }),
  getAll: (params) => api.get("/api/event-requests/all", { params }),
  getById: (id) => api.get(`/api/event-requests/${id}`),
  approve: (id, comments) =>
    api.put(`/api/event-requests/${id}/approve`, { comments }),
  reject: (id, comments) =>
    api.put(`/api/event-requests/${id}/reject`, { comments }),
  cancel: (id) => api.delete(`/api/event-requests/${id}`),
  getStats: () => api.get("/api/event-requests/stats"),
};

// Resources API
export const resourcesAPI = {
  getAll: (params) => api.get("/api/resources", { params }),
  getById: (id) => api.get(`/api/resources/${id}`),
  create: (resourceData) => api.post("/api/resources", resourceData),
  update: (id, resourceData) => api.put(`/api/resources/${id}`, resourceData),
  delete: (id) => api.delete(`/api/resources/${id}`),
  filter: (category, type, params) =>
    api.get("/api/resources/filter", {
      params: { category, type, ...params },
    }),
  search: (query, params) =>
    api.get("/api/resources/search", {
      params: { query, ...params },
    }),
  getFeatured: () => api.get("/api/resources/featured"),
  getAIGenerated: () => api.get("/api/resources/ai-generated"),
  trackDownload: (id) => api.post(`/api/resources/${id}/download`),
  getStats: () => api.get("/api/resources/stats"),
};

// Admin API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get("/api/admin/stats/dashboard"),
  getUserStats: () => api.get("/api/admin/stats/users"),
  getEventStats: () => api.get("/api/admin/stats/events"),
  getMatchStats: () => api.get("/api/admin/stats/matches"),
  getRevenueStats: () => api.get("/api/admin/stats/revenue"),

  // User Management
  getAllUsers: (params) => api.get("/api/admin/users", { params }),
  getUserById: (id) => api.get(`/api/admin/users/${id}`),
  updateUserRoles: (id, roles) =>
    api.put(`/api/admin/users/${id}/roles`, roles),
  toggleUserBan: (id, ban) =>
    api.put(`/api/admin/users/${id}/ban`, null, { params: { ban } }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getUserActivity: (id) => api.get(`/api/admin/users/${id}/activity`),

  // Activity Logs
  getRecentActivity: (limit = 20) =>
    api.get("/api/admin/activity/recent", { params: { limit } }),

  // System Operations
  clearCache: () => api.post("/api/admin/system/clear-cache"),
  getSystemHealth: () => api.get("/api/admin/system/health"),
};

export default api;
