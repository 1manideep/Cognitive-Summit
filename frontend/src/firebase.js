// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "----",
    authDomain: "cognitive-summit.firebaseapp.com",
    projectId: "cognitive-summit",
    storageBucket: "cognitive-summit.firebasestorage.app",
    messagingSenderId: "261754510720",
    appId: "1:261754510720:web:dbdab514792e68fcd13565",
    measurementId: "G-GTH4EZT45P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
