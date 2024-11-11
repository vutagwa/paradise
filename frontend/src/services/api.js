import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDp-lH4tZYp07M7nooQGH-A9DGWBxt0T4Y",
  authDomain: "ewaste-bc9f8.firebaseapp.com",
  projectId: "ewaste-bc9f8",
  storageBucket: "ewaste-bc9f8.appspot.com",
  messagingSenderId: "226144948961",
  appId: "1:226144948961:web:5e725c7f9899fe98a01da0",
  measurementId: "G-PPRH2QSTVX"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export const uploadImageToFirebase = async (image) => {
  const storageRef = ref(storage, `images/${image.name}`);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
};

// API call to submit e-waste data
export const submitEwaste = async (ewasteData) => {
  const response = await fetch("http://localhost:5000/submit-ewaste", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ewasteData),
  });
  return response.json();
};
