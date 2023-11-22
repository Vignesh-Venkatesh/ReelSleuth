import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBstVCdV-GOAOszQTgITw_gwjfgnz8vBr4",
    authDomain: "reelsleuth.firebaseapp.com",
    projectId: "reelsleuth",
    storageBucket: "reelsleuth.appspot.com",
    messagingSenderId: "567581447205",
    appId: "1:567581447205:web:d4cce8b968fb2a87d21bcc",
    measurementId: "G-4B6BF2FWY8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();


