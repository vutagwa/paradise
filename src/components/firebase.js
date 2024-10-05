import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBfxJeN7Fpb9uSDbqL6r5UBmsjqrAyHEgs",
    authDomain: "paradise-b97e8.firebaseapp.com",
    projectId: "paradise-b97e8",
    storageBucket: "paradise-b97e8.appspot.com",
    messagingSenderId: "470845529041",
    appId: "1:470845529041:web:a86748576e6676f6911ef0",
    measurementId: "G-QDN2CC82Q4"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
