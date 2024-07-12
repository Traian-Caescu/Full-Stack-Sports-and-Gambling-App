import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCwhtMJCoZoJn3sBCdqzFl-ITI8nEAH6o",
  authDomain: "finalproject-5f47b.firebaseapp.com",
  projectId: "finalproject-5f47b",
  storageBucket: "finalproject-5f47b.appspot.com",
  messagingSenderId: "585558374589",
  appId: "1:585558374589:web:28e211f04c6cd4878b1fd4",
  measurementId: "G-8B61JD25ZV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);