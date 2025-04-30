import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrWgHtAj5sik2Ap-DFUdY1cGsUosKvt0g",
  authDomain: "exelk-erp.firebaseapp.com",
  projectId: "exelk-erp",
  storageBucket: "exelk-erp.appspot.com",
  messagingSenderId: "806104452555",
  appId: "1:806104452555:web:e84caf2cdcb6c25eb77a4e",
  measurementId: "G-HR4SJ9VSD7"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);


export { app, auth, firestore, storage,database };