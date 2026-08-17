import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfocHkDgLs_jwUxgDDKn3GKmozrdfwFLU",
  authDomain: "fitness-tracker-d6824.firebaseapp.com",
  projectId: "fitness-tracker-d6824",
  storageBucket: "fitness-tracker-d6824.firebasestorage.app",
  messagingSenderId: "617497952944",
  appId: "1:617497952944:web:b13b91765b5a1037497175"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
