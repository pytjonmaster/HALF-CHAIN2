// In-memory store
const users = new Map();
const sessions = new Map();

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15);

export const createUser = (userData) => {
  const id = generateId();
  const user = {
    id,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.set(id, user);
  return user;
};

export const findUserById = (id) => users.get(id);

export const findUserByEmail = (email) => {
  for (const user of users.values()) {
    if (user.email === email) return user;
  }
  return null;
};

export const updateUser = (id, updates) => {
  const user = users.get(id);
  if (!user) return null;
  
  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date()
  };
  users.set(id, updatedUser);
  return updatedUser;
};

export const deleteUser = (id) => {
  return users.delete(id);
};

export const getAllUsers = () => Array.from(users.values());

export const createSession = (sessionData) => {
  const id = generateId();
  const session = {
    id,
    ...sessionData,
    createdAt: new Date(),
    lastActive: new Date()
  };
  sessions.set(id, session);
  return session;
};

export const findSessionByToken = (token) => {
  for (const session of sessions.values()) {
    if (session.token === token) return session;
  }
  return null;
};

export const findSessionsByUserId = (userId) => {
  return Array.from(sessions.values())
    .filter(session => session.userId === userId);
};

export const deleteSession = (id) => {
  return sessions.delete(id);
};

export const deleteSessionsByUserId = (userId) => {
  for (const [id, session] of sessions.entries()) {
    if (session.userId === userId) {
      sessions.delete(id);
    }
  }
}; 