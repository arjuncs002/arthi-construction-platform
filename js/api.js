/* ============================================================
   ARTHI CONSTRUCTIONS — Centralized API Client
   ============================================================ */

const API_BASE_URL = 'https://arthi-backend-xrsh.onrender.com/api';

const API = {
  getToken() {
    try {
      const session = JSON.parse(localStorage.getItem('arthi_session'));
      return session ? session.token : null;
    } catch (e) {
      return null;
    }
  },

  setSession(token, user) {
    const session = {
      username: user.name,
      loginAt: new Date().toISOString(),
      token: token
    };
    localStorage.setItem('arthi_session', JSON.stringify(session));
    localStorage.setItem('arthi_profile', JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const token = this.getToken();
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  // Auth endpoints
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token && data.user) {
      this.setSession(data.token, data.user);
      return data.user;
    }
    throw new Error('Invalid login response');
  },

  async getProfile() {
    return await this.request('/auth/profile');
  },

  // Projects
  async getProjects() {
    return await this.request('/projects');
  },

  async getProjectDetails(projectId) {
    return await this.request(`/projects/${projectId}`);
  },

  // Timeline & Construction Updates
  async getTimelineUpdates(projectId) {
    return await this.request(`/updates/${projectId}`);
  },

  // Gallery
  async getGallery(projectId) {
    return await this.request(`/updates/gallery/${projectId}`);
  },

  // Documents
  async getDocuments(projectId) {
    return await this.request(`/documents/${projectId}`);
  },

  // Payments
  async getPayments(projectId) {
    return await this.request(`/payments/${projectId}`);
  },

  // Requests
  async getRequests(projectId) {
    return await this.request(`/requests/${projectId}`);
  },

  async raiseRequest(projectId, requestData) {
    return await this.request(`/requests/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  // Site visits
  async getVisits(projectId) {
    return await this.request(`/visits/${projectId}`);
  },

  async bookVisit(projectId, visitData) {
    return await this.request(`/visits/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(visitData)
    });
  },

  // Notifications
  async getNotifications() {
    return await this.request('/notifications');
  },

  async markNotificationRead(notifId) {
    return await this.request(`/notifications/${notifId}/read`, {
      method: 'PATCH'
    });
  },

  // Chat
  async getChatHistory(projectId) {
    return await this.request(`/chat/messages/${projectId}`);
  },

  async sendChatMessage(projectId, content, clientId = null) {
    let url = `/chat/messages/${projectId}`;
    if (clientId) {
      url += `?clientId=${clientId}`;
    }
    return await this.request(url, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  }
};
