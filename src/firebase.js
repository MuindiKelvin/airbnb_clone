import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCrdXkNjsIC9JyAMv7I4Kf9Ut3EjHpQyIk",
  authDomain: "airbnb-clone-af8c0.firebaseapp.com",
  projectId: "airbnb-clone-af8c0",
  storageBucket: "airbnb-clone-af8c0.firebasestorage.app",
  messagingSenderId: "55212828140",
  appId: "1:55212828140:web:d54a0943af014c8f588cc9",
  measurementId: "G-RJ4B19RC5J"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { auth, db };