// Firebase configuration for authentication
// This is a mock implementation for demonstration purposes
// In a real application, you would use the actual Firebase SDK

const mockUser = {
  uid: '123456789',
  email: 'test@example.com',
  displayName: 'Test User'
};

// Mock authentication functions
export const subscribeToAuthState = (callback) => {
  // Simulate initial check
  setTimeout(() => {
    callback(null); // Not logged in initially
  }, 500);
  
  // Return unsubscribe function
  return () => {
    console.log('Unsubscribed from auth state');
  };
};

export const loginUser = async (email, password) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (email === 'test@example.com' && password === 'password123') {
      return {
        success: true,
        user: mockUser
      };
    } else {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Login failed'
    };
  }
};

export const registerUser = async (email, password) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      user: {
        uid: 'newuser_' + Date.now(),
        email,
        displayName: email.split('@')[0]
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Registration failed'
    };
  }
};

export const logoutUser = async () => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Logout failed'
    };
  }
};

export const getCurrentUser = () => {
  return null; // Not logged in by default
};
