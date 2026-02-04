// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBF6Vg1Zmj2urVEDHRVysQ3rS45sH0cNwQ",
  authDomain: "amanzon-clone-915c3.firebaseapp.com",
  databaseURL: "https://amanzon-clone-915c3-default-rtdb.firebaseio.com",
  projectId: "amanzon-clone-915c3",
  storageBucket: "amanzon-clone-915c3.firebasestorage.app",
  messagingSenderId: "295943911973",
  appId: "1:295943911973:web:15376a1a620a5544ec1dcc",
  measurementId: "G-X171VX0W63"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = app.firestore();

// Authentication functions
export const subscribeToAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};
