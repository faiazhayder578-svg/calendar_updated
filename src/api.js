const BASE = "http://localhost:5000";

// LocalStorage-based auth (more reliable than cookies for cross-origin)
const AUTH_KEY = 'scheduler_auth';

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredAuth(user) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function getStoredUser() {
  const auth = getStoredAuth();
  return auth?.user || null;
}

export function isAuthenticated() {
  return getStoredAuth() !== null;
}

export async function getClasses() {
  const res = await fetch(`${BASE}/api/classes`);
  return res.json();
}

export async function addClass(data) {
  const res = await fetch(`${BASE}/api/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function deleteClass(id) {
  const res = await fetch(`${BASE}/api/classes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function updateClass(id, data) {
  const res = await fetch(`${BASE}/api/classes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

// Authentication API - using localStorage instead of cookies
export async function login(username, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Login failed");
  }

  const data = await res.json();
  
  // Store auth in localStorage
  setStoredAuth({ user: data.user, loggedInAt: Date.now() });
  
  return data;
}

export async function logout() {
  // Clear localStorage
  setStoredAuth(null);
  
  // Also call backend to clear session (optional)
  try {
    await fetch(`${BASE}/api/auth/logout`, {
      method: "POST",
    });
  } catch {
    // Ignore errors - localStorage is already cleared
  }

  return { message: "Logout successful" };
}

export async function checkAuth() {
  // Check localStorage first
  const stored = getStoredAuth();
  
  if (!stored) {
    return { authenticated: false };
  }
  
  // Check if session is still valid (24 hour expiry)
  const sessionAge = Date.now() - stored.loggedInAt;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  if (sessionAge > maxAge) {
    setStoredAuth(null);
    return { authenticated: false };
  }
  
  return { authenticated: true, user: stored.user };
}

export async function changePassword(currentPassword, newPassword) {
  const stored = getStoredAuth();
  if (!stored) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${BASE}/api/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      username: stored.user.username,
      currentPassword, 
      newPassword 
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Password change failed");
  }

  return res.json();
}

// Instructor Availability API
export async function checkInstructorAvailability(instructorName, days, timeSlot, excludeClassId = null) {
  const res = await fetch(`${BASE}/api/check-instructor-availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instructorName,
      days,
      timeSlot,
      excludeClassId
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Availability check failed");
  }

  return res.json();
}

export async function getInstructorAvailability(instructorName) {
  const res = await fetch(`${BASE}/api/instructor-availability/${encodeURIComponent(instructorName)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch instructor availability");
  }

  return res.json();
}

export async function getAvailableSections(courseCode) {
  const res = await fetch(`${BASE}/api/available-sections/${encodeURIComponent(courseCode)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch available sections");
  }

  return res.json();
}


// Room availability API
export async function getRoomAvailability(days, time) {
  const res = await fetch(`${BASE}/api/room-availability?days=${encodeURIComponent(days)}&time=${encodeURIComponent(time)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch room availability");
  }

  return res.json();
}
