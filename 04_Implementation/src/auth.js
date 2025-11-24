// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvyJSvjBCWWUlnSZ5xD7N4jAhRzexwhLc",
  authDomain: "wording-f2155.firebaseapp.com",
  projectId: "wording-f2155",
  storageBucket: "wording-f2155.firebasestorage.app",
  messagingSenderId: "773923979216",
  appId: "1:773923979216:web:e550f05256ed53a40a43d5"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// --- AUTH FUNCTIONS ---

// Function to handle user sign up with email and password
async function signUpWithEmail(email, password) {
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error };
    }
}

// Function to handle user login with email and password
async function loginWithEmail(email, password) {
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error };
    }
}

// Function to handle user login with Google
async function loginWithGoogle() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: error };
    }
}

// Function to handle user logout
async function logoutUser() {
    try {
        await auth.signOut();
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error };
    }
}

// Function to listen for authentication state changes
function onAuthStateChanged(callback) {
    auth.onAuthStateChanged(callback);
}
