/* ============================================================
   AUTH — session management shared across all pages
   ============================================================ */

const AUTH = {
  SESSION_KEY: 'arthi_session',
  PROFILE_KEY: 'arthi_profile',

  async login(username, password) {
    try {
      const user = await API.login(username, password);
      return !!user;
    } catch (e) {
      console.error('Authentication login failed:', e);
      return false;
    }
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    localStorage.removeItem('arthi_room_layout');
    window.location.href = 'index.html';
  },

  isLoggedIn() {
    return !!localStorage.getItem(this.SESSION_KEY);
  },

  getProfile() {
    try {
      return JSON.parse(localStorage.getItem(this.PROFILE_KEY)) || {};
    } catch (e) { return {}; }
  },

  saveProfile(profile) {
    localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
  },

  // Call at the top of any protected page
  guard() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
    }
  }
};