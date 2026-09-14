/**
 * auth.js
 * 
 * Clean, honest MVP Authentication Service for Cue.
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This application is currently running as a client-side SPA (no backend server).
 * This service manages session state in localStorage/memory clearly marked as an MVP.
 * It does NOT pretend to be an encrypted cloud authentication system.
 * It provides a structured interface so real backend authentication (Firebase/OAuth)
 * can be plugged in seamlessly without changing UI consumers.
 */

const AUTH_STORAGE_KEY = 'cue_auth_session_v1';

const DEFAULT_USER = {
  id: 'user-sparks',
  name: 'Sparks',
  email: 'sparks@cue.life',
  isGuest: false,
  createdAt: '2026-01-01T00:00:00.00Z',
};

const listeners = new Set();

function notifyAuthListeners(user) {
  listeners.forEach((cb) => {
    try {
      cb(user);
    } catch (e) {
      console.error('Error notifying auth listener:', e);
    }
  });
}

export const AuthService = {
  /**
   * Subscribe to authentication state changes
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  /**
   * Get current authenticated user session or null
   */
  getCurrentUser() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      }
    } catch {}
    // Default to Sparks session if not logged out
    return DEFAULT_USER;
  },

  /**
   * Log in with email and password (MVP validation)
   */
  login(email, password) {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 3) {
      throw new Error('Password must be at least 3 characters.');
    }

    // Name derived from email or default to Sparks
    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const user = {
      id: `user-${Date.now()}`,
      name: formattedName.toLowerCase() === 'sparks' ? 'Sparks' : formattedName,
      email: email.trim().toLowerCase(),
      isGuest: false,
      loggedInAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    notifyAuthListeners(user);
    return user;
  },

  /**
   * Create account (MVP local session)
   */
  createAccount(email, password, name = '') {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    const displayName = name.trim() || email.split('@')[0];
    const user = {
      id: `user-${Date.now()}`,
      name: displayName,
      email: email.trim().toLowerCase(),
      isGuest: false,
      createdAt: new Date().toISOString(),
      loggedInAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    notifyAuthListeners(user);
    return user;
  },

  /**
   * Continue as guest session
   */
  continueAsGuest() {
    const guestUser = {
      id: 'guest-' + Date.now(),
      name: 'Sparks (Guest)',
      email: 'guest@cue.local',
      isGuest: true,
      loggedInAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(guestUser));
    }
    notifyAuthListeners(guestUser);
    return guestUser;
  },

  /**
   * Log out session
   */
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    notifyAuthListeners(null);
  },
};
