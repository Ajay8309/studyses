import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import axios from "axios";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
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

const fetchAITodo = async () => {
  try {
    console.log("Fetching AI To-Do...");
    const response = await axios.get("https://api.sree.shop/v1", {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_SREE_API_KEY}` }
    });
    console.log("AI To-Do Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching AI To-Do:", error.message);
    if (error.response) {
      console.error("Response Data:", error.response.data);
      console.error("Response Status:", error.response.status);
    }
    return [];
  }
};


const getTodos = async (userId) => {
  if (!userId) return [];
  const todosRef = collection(db, "todos", userId, "userTodos");
  const snapshot = await getDocs(todosRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addTodo = async (userId, task) => {
  if (!userId || !task) return null;
  const todosRef = collection(db, "todos", userId, "userTodos");
  const docRef = await addDoc(todosRef, { task, completed: false });
  return docRef.id;
};

const deleteTodo = async (userId, todoId) => {
  const todoRef = doc(db, "todos", userId, "userTodos", todoId);
  await deleteDoc(todoRef);
};

const updateTodo = async (userId, todoId, newTask = null, completed = null) => {
  const todoRef = doc(db, "todos", userId, "userTodos", todoId);
  const updateData = {};

  if (newTask !== null) updateData.task = newTask;
  if (completed !== null) updateData.completed = completed;

  await updateDoc(todoRef, updateData);
};


const toggleTodoComplete = async (userId, todoId) => {
  if (!userId || !todoId) return;
  const todoRef = doc(db, "todos", userId, "userTodos", todoId);
  const todoSnap = await getDoc(todoRef);
  if (todoSnap.exists()) {
    await updateDoc(todoRef, { completed: !todoSnap.data().completed });
  }
};

export { auth, db, signInWithGoogle, logout, fetchAITodo, addTodo, getTodos, toggleTodoComplete, deleteTodo, updateTodo };
