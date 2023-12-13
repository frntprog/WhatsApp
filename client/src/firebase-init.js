import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB79cCmwbeMHFCemF3cRISaxRCJgCiKw14",
  authDomain: "whatsapp-clone-6e4ac.firebaseapp.com",
  projectId: "whatsapp-clone-6e4ac",
  storageBucket: "whatsapp-clone-6e4ac.appspot.com",
  messagingSenderId: "785960953516",
  appId: "1:785960953516:web:9c7fde7dec0837e7dc6109",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
