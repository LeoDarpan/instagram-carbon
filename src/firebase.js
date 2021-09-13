import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDkUH4NRIBLgmbLzUuDz-IGdRn6r2Mj3kY",
    authDomain: "instagram-carbon.firebaseapp.com",
    projectId: "instagram-carbon",
    storageBucket: "instagram-carbon.appspot.com",
    messagingSenderId: "549979688533",
    appId: "1:549979688533:web:29e1ce418d514361d24edc",
    measurementId: "G-7HM9YVJ1B0"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
 
export { db, auth, storage };