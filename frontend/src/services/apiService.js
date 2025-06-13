// API Service for frontend-backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    const session = JSON.parse(localStorage.getItem('half_chain_session') || '{}');
    return session.token || null;
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    const session = JSON.parse(localStorage.getItem('half_chain_session') || '{}');
    session.token = token;
    localStorage.setItem('half_chain_session', JSON.stringify(session));
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem('half_chain_session');
    localStorage.removeItem('half_chain_user');
  }

  // Make HTTP request with proper error handling
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          this.removeAuthToken();
          throw new Error(data.message || 'Authentication failed');
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(userData) {
    return this.makeRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials) {
    const response = await this.makeRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async getProfile() {
    return this.makeRequest('/auth/profile');
  }

  async verifyEmail(token) {
    return this.makeRequest(`/auth/verify-email/${token}`);
  }

  async forgotPassword(email) {
    return this.makeRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.makeRequest(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getSessions() {
    return this.makeRequest('/auth/sessions');
  }

  async revokeSession(sessionToken) {
    return this.makeRequest(`/auth/sessions/${sessionToken}`, {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAllUsers() {
    return this.makeRequest('/auth/users');
  }

  async getUserById(userId) {
    return this.makeRequest(`/auth/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.makeRequest(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.makeRequest(`/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getSystemStats() {
    return this.makeRequest('/auth/stats');
  }

  // Utility method to check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 