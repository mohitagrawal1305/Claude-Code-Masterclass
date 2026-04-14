import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  projectId: "pocket-heist-1305",
  appId: "1:978964706995:web:ebd5f4352ab0a4352d22c6",
  storageBucket: "pocket-heist-1305.firebasestorage.app",
  apiKey: "AIzaSyDQ_xfVkJ5fKDsAtR96uZFw0-Hko0aOuyg",
  authDomain: "pocket-heist-1305.firebaseapp.com",
  messagingSenderId: "978964706995",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
