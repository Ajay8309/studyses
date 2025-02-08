import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDuration, startTimer, pauseTimer, resetTimer, tick, completeSession } from "../store/timerSlice";
import { db } from "../firebase"; 
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import useAuth from "./useAuth"; 
import completionSound from "../assets/completionSound.mp3";
import React from "react";


export default function Timer() {
  const dispatch = useDispatch();
  const { timeLeft, isRunning, duration } = useSelector((state) => state.timer);
  const [customMinutes, setCustomMinutes] = useState(duration / 60);
  const [showOverlay, setShowOverlay] = useState(false);
  const user = useAuth(); 
  const audio = new Audio(completionSound);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else if (timeLeft === 0) {
      audio.play();
      dispatch(completeSession());
      saveSessionToFirestore();
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 5000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, dispatch]);

  const saveSessionToFirestore = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated.");
      return;
    }
  
    const userRef = doc(db, "sessions", user.uid);
  
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, { history: [] }, { merge: true });
      }
  
      const userData = docSnap.data();
      if (!userData || !Array.isArray(userData.history)) {
        await updateDoc(userRef, { history: [] });
      }
  
      await updateDoc(userRef, {
        history: arrayUnion({
          duration,
          completedAt: new Date().toISOString(),
        }),
      });
  
      console.log("Session saved successfully!");
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };
  

  const handleTimeChange = (amount) => {
    const newMinutes = Math.max(1, customMinutes + amount);
    setCustomMinutes(newMinutes);
    dispatch(setDuration(newMinutes * 60));
  };

  return (
    <div className="relative">
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Session Completed! 🎉</h2>
            <p className="text-gray-700 mb-4">Great job! Take a break or start another session.</p>
            <button
              onClick={() => setShowOverlay(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center bg-gray-900 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <button onClick={() => handleTimeChange(-5)} className="bg-gray-700 px-4 py-2 rounded-lg">-5 min</button>
          <div className="text-4xl font-bold bg-gray-800 px-6 py-3 rounded-lg">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
          <button onClick={() => handleTimeChange(5)} className="bg-gray-700 px-4 py-2 rounded-lg">+5 min</button>
        </div>

        <div className="flex space-x-4">
          {!isRunning ? (
            <button onClick={() => dispatch(startTimer())} className="bg-green-500 px-6 py-2 rounded-lg">Start</button>
          ) : (
            <button onClick={() => dispatch(pauseTimer())} className="bg-yellow-500 px-6 py-2 rounded-lg">Pause</button>
          )}
          <button onClick={() => dispatch(resetTimer())} className="bg-red-500 px-6 py-2 rounded-lg">Reset</button>
        </div>
      </div>
    </div>
  );
}
