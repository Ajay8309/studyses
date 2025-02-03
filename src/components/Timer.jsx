import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setDuration, startTimer, pauseTimer, resetTimer, tick, completeSession } from "../store/timerSlice";
import completionSound from "../assets/completionSound.mp3"; // Add a notification sound

export default function Timer() {
  const dispatch = useDispatch();
  const { timeLeft, isRunning, duration } = useSelector((state) => state.timer);
  const [customMinutes, setCustomMinutes] = useState(duration / 60);
  const [showOverlay, setShowOverlay] = useState(false);
  const audio = new Audio(completionSound); // Load the sound

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else if (timeLeft === 0) {
      audio.play(); // Play sound on completion
      dispatch(completeSession());
      setShowOverlay(true); // Show overlay
      setTimeout(() => setShowOverlay(false), 5000); // Hide overlay after 5s
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, dispatch]);

  const handleTimeChange = (amount) => {
    const newMinutes = Math.max(1, customMinutes + amount);
    setCustomMinutes(newMinutes);
    dispatch(setDuration(newMinutes * 60));
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-4">
      {/* Overlay Notification */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4">
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

      {/* Timer UI */}
      <div className="flex flex-col items-center bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        {/* Time Adjust Buttons */}
        <div className="flex items-center justify-between w-full max-w-xs mb-4">
          <button 
            onClick={() => handleTimeChange(-5)} 
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            -5 min
          </button>

          <div className="text-4xl sm:text-5xl font-bold bg-gray-800 px-6 py-3 rounded-lg text-center w-36 sm:w-40">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>

          <button 
            onClick={() => handleTimeChange(5)} 
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm sm:text-base"
          >
            +5 min
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-4 w-full">
          {!isRunning ? (
            <button 
              onClick={() => dispatch(startTimer())} 
              className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg text-sm sm:text-base w-24"
            >
              Start
            </button>
          ) : (
            <button 
              onClick={() => dispatch(pauseTimer())} 
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg text-sm sm:text-base w-24"
            >
              Pause
            </button>
          )}
          <button 
            onClick={() => dispatch(resetTimer())} 
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-sm sm:text-base w-24"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
