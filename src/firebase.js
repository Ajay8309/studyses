import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDEJpOQZYBX2dje09fu6NPL5E_gCbgZOG8",
    authDomain: "new-solo-4c49e.firebaseapp.com",
    projectId: "new-solo-4c49e",
    storageBucket: "new-solo-4c49e.firebasestorage.app",
    messagingSenderId: "575059377222",
    appId: "1:575059377222:web:f3730fce23efbef247de47",
    measurementId: "G-3F963C5DVK"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      profilePic: user.photoURL,
      lastLogin: new Date(),
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const logout = async () => {
  await signOut(auth);
};

export { auth, db, signInWithGoogle, logout };
