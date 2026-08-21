import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfigData from "../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfigData.apiKey || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfigData.projectId || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfigData.appId || "",
};

// Initialize Firebase client safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || "(default)");

// Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

const microsoftProvider = new OAuthProvider("microsoft.com");
microsoftProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  app,
  auth,
  db,
  googleProvider,
  githubProvider,
  microsoftProvider,
  signInWithPopup,
  signOut,
};
