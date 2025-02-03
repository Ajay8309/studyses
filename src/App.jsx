import { Provider } from "react-redux";
import { store } from "./store/store";
import Timer from "./components/Timer";
import BackgroundSelector from "./components/BackgroundSelector";
import SessionStats from "./components/SessionStats";
import SoundPlayer from "./components/SoundPlayer";
import { useSelector } from "react-redux";
import { selectCurrentBackground, selectBackgrounds } from "./store/backgroundSlice";
import React, { useState, useEffect } from "react";

function AppContent() {
  const currentBackground = useSelector(selectCurrentBackground);
  const backgrounds = useSelector(selectBackgrounds);
  const [showTimer, setShowTimer] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  const selectedBg = backgrounds.find((bg) => bg.id === currentBackground)?.image || "";

  // Motivational Quotes
  const quotes = [
    "Believe in yourself and all that you are.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "You are never too old to set another goal or to dream a new dream.",
    "It always seems impossible until it's done.",
    "Push yourself, because no one else is going to do it for you."
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className="min-h-screen transition-all duration-500 flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage: `url(${selectedBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Study Timer Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mt-6 absolute top-6">
        Study Timer
      </h1>

      {/* Quote Box (Responsive) */}
      <div className="bg-black bg-opacity-50 text-white text-lg sm:text-xl font-semibold px-6 py-4 rounded-lg shadow-lg text-center w-full max-w-lg mt-16 sm:mt-20">
        {currentQuote}
      </div>

      {/* Fullscreen Toggle & Background Button */}
      <div className="fixed top-4 right-4 flex flex-col space-y-3 sm:space-y-4">
        <button
          onClick={toggleFullScreen}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Fullscreen
        </button>

        <button
          onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Background
        </button>
        {showBackgroundSelector && <BackgroundSelector />}
      </div>

      {/* Sidebar Buttons (Responsive) */}
      <div className="fixed top-4 left-4 flex flex-col space-y-3 sm:space-y-4">
        <button onClick={() => setShowTimer(!showTimer)} className="btn">Timer</button>
        {showTimer && <Timer />}

        <button onClick={() => setShowSessionStats(!showSessionStats)} className="btn">Session Stats</button>
        {showSessionStats && <SessionStats />}
      </div>

      {/* Sound Player (Draggable) */}
      <div className="fixed bottom-4 left-4">
        <SoundPlayer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
