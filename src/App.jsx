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

  // Function to toggle fullscreen mode
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
      className="min-h-screen transition-all duration-500 relative flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${selectedBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Study Timer Title Fixed at the Top */}
      <h1 className="text-4xl font-bold text-center text-white mt-8 absolute top-4">
        Study Timer
      </h1>

      <div className="container mx-auto px-4 py-8 relative flex flex-col items-center">
        {/* Motivational Quote in the Center */}
        <div className="bg-black bg-opacity-50 text-white text-xl font-semibold px-6 py-4 rounded-lg shadow-lg text-center">
          {currentQuote}
        </div>

        {/* Fullscreen Toggle Button */}
        <div className="fixed top-4 right-4 flex flex-col space-y-4">
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
          {showBackgroundSelector && (
            <div className="animate-fade-in">
              <BackgroundSelector />
            </div>
          )}
        </div>

        {/* Left Sidebar Controls (Timer & Session Stats) */}
        <div className="fixed top-4 left-4 flex flex-col space-y-4">
          <button
            onClick={() => setShowTimer(!showTimer)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Timer
          </button>
          {showTimer && (
            <div className="animate-fade-in">
              <Timer />
            </div>
          )}

          <button
            onClick={() => setShowSessionStats(!showSessionStats)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Session Stats
          </button>
          {showSessionStats && (
            <div className="animate-fade-in">
              <SessionStats />
            </div>
          )}
        </div>

        {/* Bottom Left: Sound Player */}
        <div className="fixed bottom-4 left-4">
          <SoundPlayer />
        </div>
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
