import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBOIzrE4Ov7IxvrhdDiuXB_gA9SScGhpnk",
    authDomain: "siscop-58e74.firebaseapp.com",
    projectId: "siscop-58e74",
    storageBucket: "siscop-58e74.appspot.com",
    messagingSenderId: "1036737537637",
    appId: "1:1036737537637:web:1777d1357af2f8d4cb088c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };