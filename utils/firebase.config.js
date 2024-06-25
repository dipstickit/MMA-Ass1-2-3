// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6blOiJUbvUWPGn4Iock24kblvZnyE58Q",
  authDomain: "testauth-995fc.firebaseapp.com",
  projectId: "testauth-995fc",
  storageBucket: "testauth-995fc.appspot.com",
  messagingSenderId: "851737603389",
  appId: "1:851737603389:web:3e2d1316584608b949a954",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth };
