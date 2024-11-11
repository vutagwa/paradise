import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, signOut, RecaptchaVerifier, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Firebase Configuration (Replace with environment variables in production)
const firebaseConfig = {
  apiKey: "AIzaSyDp-lH4tZYp07M7nooQGH-A9DGWBxt0T4Y",
  authDomain: "ewaste-bc9f8.firebaseapp.com",
  projectId: "ewaste-bc9f8",
  storageBucket: "ewaste-bc9f8.appspot.com",
  messagingSenderId: "226144948961",
  appId: "1:226144948961:web:5e725c7f9899fe98a01da0",
  measurementId: "G-PPRH2QSTVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication Functions
const signUpWithEmail = async (email, password, firstName, lastName, role, contactNumber) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Store user details in Firestore
    await setDoc(doc(db, 'users', userId), {
      firstName,
      lastName,
      role,
      contactNumber,
      passkey: generateUniquePasskey(),
    });

    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    throw new Error('Error creating account. Please try again later.');
  }
};

const signInWithEmail = async (email, password) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error during sign-in:", error.message);
    throw new Error('Invalid email or password. Please try again.');
  }
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error during Google sign-in:", error.message);
    throw new Error('Google sign-in failed. Please try again.');
  }
};

const signInWithPhone = (phoneNumber, appVerifier) => {
  try {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    console.error("Error during phone sign-in:", error.message);
    throw new Error('Phone number verification failed. Please try again.');
  }
};

const logout = () => {
  return signOut(auth);
};

// Get User Role from Firestore
const getUserRoleFromFirestore = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role;
    } else {
      throw new Error("No such user document!");
    }
  } catch (error) {
    console.error("Error fetching user role:", error.message);
    throw new Error('Unable to fetch user role. Please try again.');
  }
};

// Utility to Generate Unique Passkey
const generateUniquePasskey = () => {
  return 'PASSKEY-' + uuidv4();
};

// Upload Image to Firebase Storage and Get URL
export const uploadImageToFirebase = async (image) => {
  try {
    const storageRef = ref(storage, `images/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw new Error('Image upload failed. Please try again.');
  }
};

// reCAPTCHA setup for Phone Authentication
export const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear(); // Clear previous instance
  }

  window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response) => {
      console.log('Captcha resolved', response);
    },
    'expired-callback': () => {
      console.log('Captcha expired');
    }
  }, auth);
};

// Exporting the initialized services


// reCAPTCHA Phone Authentication
export const signInWithPhoneVerification = async (phoneNumber) => {
  const appVerifier = window.recaptchaVerifier;  // Use the initialized reCAPTCHA
  const phoneProvider = new PhoneAuthProvider(auth);

  try {
    const confirmationResult = await phoneProvider.verifyPhoneNumber(phoneNumber, appVerifier);
    return confirmationResult;  // Return confirmation result for further processing
  } catch (error) {
    console.error("Error during phone sign-in:", error.message);
    throw new Error('Phone verification failed. Please try again.');
  }
};

// Consolidated export to avoid duplication
export { auth, db, storage, signInWithEmail, signInWithGoogle, signInWithPhone, signUpWithEmail, logout, getUserRoleFromFirestore };
