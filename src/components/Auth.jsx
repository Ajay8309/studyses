import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";


export default function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      {user ? (
        <div>
          <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full mb-2" />
          <h2 className="text-lg font-semibold">{user.displayName}</h2>
          <p>{user.email}</p>
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-4">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
