// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC93NY-qJ8zN7w8S2fdhvanChlwz-4_08",
  authDomain: "reactinstagramclone-e13a5.firebaseapp.com",
  projectId: "reactinstagramclone-e13a5",
  storageBucket: "reactinstagramclone-e13a5.appspot.com",
  messagingSenderId: "280721859504",
  appId: "1:280721859504:web:08eed4313587ca9e7d6c75",
  measurementId: "G-F6ZXBZREDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export {auth};
export default db;