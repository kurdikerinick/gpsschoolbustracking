import { getDatabase, ref, update, push, set,get, onValue as firebaseOnValue  } from 'firebase/database'; // Import necessary functions for Realtime Database
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth function from firebase/auth
import { getStorage } from 'firebase/storage'; // Import the getStorage function
import 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyAFJXVS67agokw7MjFTwWq87tbV-ZEy_pA",
  authDomain: "gpstracking-c79db.firebaseapp.com",
  databaseURL: "https://gpstracking-c79db-default-rtdb.firebaseio.com",
  projectId: "gpstracking-c79db",
  storageBucket: "gpstracking-c79db.appspot.com",
  messagingSenderId: "421233199157",
  appId: "1:421233199157:web:65a239c786784afcd4497c"
};


const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);

// Export necessary Firebase objects and functions
export { app, db, auth, storage, update,push, ref, set,get , firebaseOnValue as onValue };