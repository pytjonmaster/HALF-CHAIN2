import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEYS = {
  USER: 'half_chain_user',
  USERS: 'half_chain_users',
  SESSION: 'half_chain_session'
};

const SESSION_DURATION = {
  REMEMBER_ME: 30 * 24 * 60 * 60 * 1000, // 30 days
  DEFAULT: 7 * 24 * 60 * 60 * 1000 // 7 days (1 week)
};

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
        
        // Check if session is still valid
        if (session.expiresAt && new Date(session.expiresAt) > new Date()) {
          return parsedUser;
        } else {
          // Clear expired session
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.SESSION);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  });

  // Initialize users from localStorage with proper error handling
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      return savedUsers ? JSON.parse(savedUsers) : {};
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      return {};
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCodes, setVerificationCodes] = useState({});

  // Persist users to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }, [users]);

  // Function to create a new session
  const createSession = (rememberMe = false) => {
    const expiresAt = new Date(Date.now() + (rememberMe ? SESSION_DURATION.REMEMBER_ME : SESSION_DURATION.DEFAULT));
    const session = {
      expiresAt: expiresAt.toISOString(),
      rememberMe
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  };

  // Function to clear session
  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationCode = async (email) => {
    try {
      setLoading(true);
      setError('');

      if (!users[email]) {
        throw new Error('No account found with this email address');
      }

      const code = generateVerificationCode();
      setVerificationCodes(prev => ({
        ...prev,
        [email]: code
      }));

      console.log(`Verification code for ${email}: ${code}`);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email, code) => {
    try {
      setLoading(true);
      setError('');

      if (!verificationCodes[email]) {
        throw new Error('No verification code found. Please request a new code.');
      }

      if (verificationCodes[email] !== code) {
        throw new Error('Incorrect verification code. Please try again.');
      }

      setVerificationCodes(prev => {
        const newCodes = { ...prev };
        delete newCodes[email];
        return newCodes;
      });

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      setLoading(true);
      setError('');

      if (!users[email]) {
        throw new Error('No account found with this email address');
      }

      setUsers(prev => ({
        ...prev,
        [email]: { ...prev[email], password: newPassword }
      }));

      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    try {
      setLoading(true);
      setError('');

      if (users[email]) {
        throw new Error('An account with this email already exists');
      }

      const newUser = { email, password };
      setUsers(prev => ({
        ...prev,
        [email]: newUser
      }));
      
      const userData = { email };
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      createSession(false); // Default session duration for new signups

      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError('');

      const userAccount = users[email];
      if (!userAccount) {
        throw new Error('No account found with this email');
      }

      if (userAccount.password !== password) {
        throw new Error('Invalid password');
      }

      const userData = { email };
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      createSession(rememberMe);
      
      return userData;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    setUser(null);
    clearSession();
    setError('');
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if Google is loaded
      if (!window.google) {
        throw new Error('Google Sign-In not loaded. Please refresh the page and try again.');
      }

      // Your Google Client ID - REPLACE WITH YOUR ACTUAL CLIENT ID
      const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';
      
      if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        throw new Error('Please configure your Google Client ID in the environment variables.');
      }

      // Initialize Google Identity Services
      const response = await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          },
        });

        // Prompt for Google Sign-In
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to popup if prompt is not displayed
            window.google.accounts.id.renderButton(
              document.createElement('div'),
              {
                theme: 'outline',
                size: 'large',
                type: 'standard',
              }
            );
            
            // Use OAuth 2.0 flow as fallback
            const client = window.google.accounts.oauth2.initTokenClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'email profile',
              callback: (tokenResponse) => {
                if (tokenResponse.error) {
                  reject(new Error(tokenResponse.error));
                } else {
                  // Get user info using the access token
                  fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  })
                  .then(res => res.json())
                  .then(userInfo => {
                    resolve({
                      credential: null,
                      userInfo: userInfo
                    });
                  })
                  .catch(err => reject(err));
                }
              },
            });
            client.requestAccessToken();
          }
        });
      });

      let userInfo;
      
      if (response.credential) {
        // Decode the JWT credential to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        userInfo = {
          email: payload.email,
          name: payload.name,
          id: payload.sub,
          picture: payload.picture
        };
      } else if (response.userInfo) {
        // From OAuth 2.0 flow
        userInfo = response.userInfo;
      } else {
        throw new Error('Failed to get user information from Google');
      }

      const email = userInfo.email;
      const name = userInfo.name;

      // Check if user exists, if not create them
      if (!users[email]) {
        const newUser = { 
          email, 
          password: null, // Google users don't need password
          name,
          provider: 'google',
          googleId: userInfo.id,
          picture: userInfo.picture
        };
        setUsers(prev => ({
          ...prev,
          [email]: newUser
        }));
      }

      const userData = { 
        email, 
        name, 
        provider: 'google',
        picture: userInfo.picture 
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      createSession(false);
      
      return userData;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check session validity periodically
  useEffect(() => {
    const checkSession = () => {
      if (user) {
        try {
          const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION) || '{}');
          if (session.expiresAt && new Date(session.expiresAt) <= new Date()) {
            signout();
          }
        } catch (error) {
          console.error('Error checking session:', error);
          signout();
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user]);

  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    signout,
    signInWithGoogle,
    sendVerificationCode,
    verifyCode,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 