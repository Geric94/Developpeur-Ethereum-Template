// Import the functions you need from the SDKs you need
import firebase from "firebase";
//import "firebase/firestore";
//import "firebase/auth";
//import { getFirestore, collection } from 'firebase';
//import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDiI8mrcssx5bCDchw0XMl0EYcED5j0nzI",
    authDomain: "voting-ca632.firebaseapp.com",
    projectId: "voting-ca632",
    storageBucket: "voting-ca632.appspot.com",
    messagingSenderId: "275180841577",
    appId: "1:275180841577:web:d57d5a4c2f33115c4f10f8"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
//const firebaseVotingDB = getFirestore(appVoting);
//const votantsCol = collection(firebaseVotingDB, 'listvotants');
//const listVotants = await getDocs(votantsCol);
//const listVotants = getDocs(votantsCol);


export default firebaseApp;