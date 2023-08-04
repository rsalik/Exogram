import { building } from "$app/environment";
import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";

export let db: Database;
export let auth: Auth;

if (!building) {
  const app = initializeApp({
    apiKey: "AIzaSyDWoUGgK4tQo96ie12V_cJ0ZQN-PJJX_go",
    authDomain: "exogram-46cc8.firebaseapp.com",
    databaseURL: "https://exogram-46cc8-default-rtdb.firebaseio.com",
    projectId: "exogram-46cc8",
    storageBucket: "exogram-46cc8.appspot.com",
    messagingSenderId: "1082408161985",
    appId: "1:1082408161985:web:6b8e100c78aafcb5f07a40",
    measurementId: "G-VP91XQLW8W",
  });

  db = getDatabase(app);
  auth = getAuth(app);
}
