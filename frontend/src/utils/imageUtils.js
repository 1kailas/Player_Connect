/**
 * Utility function to get full image URL from relative path
 * @param {string} path - The relative path (e.g., /uploads/profiles/...)
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Prepend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  return `${API_URL}${path}`;
};

/**
 * Utility function to get profile picture URL or default
 * @param {string} profilePictureUrl - The profile picture URL
 * @returns {string|null} - Full URL or null for default
 */
export const getProfilePictureUrl = (profilePictureUrl) => {
  return getImageUrl(profilePictureUrl);
};
