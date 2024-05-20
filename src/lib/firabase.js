import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-31474.firebaseapp.com",
  projectId: "chat-app-31474",
  storageBucket: "chat-app-31474.appspot.com",
  messagingSenderId: "990999019127",
  appId: "1:990999019127:web:7c541d16165a6b184dd072"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()