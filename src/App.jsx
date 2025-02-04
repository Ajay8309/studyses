import { Provider } from "react-redux";
import { store } from "./store/store";
import Timer from "./components/Timer";
import BackgroundSelector from "./components/BackgroundSelector";
import SessionStats from "./components/SessionStats";
import SoundPlayer from "./components/SoundPlayer";
import { useSelector } from "react-redux";
import { selectCurrentBackground, selectBackgrounds, selectVideoUrl, selectVideoMuted, toggleVideoMute, selectVideoVolume, setVideoVolume } from "./store/backgroundSlice";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRef } from "react";

function AppContent() {
  const dispatch = useDispatch();
  const currentBackground = useSelector(selectCurrentBackground);
  const backgrounds = useSelector(selectBackgrounds);
  const videoUrl = useSelector(selectVideoUrl);
  const videoMuted = useSelector(selectVideoMuted);
  const videoVolume = useSelector(selectVideoVolume);
  
  const [showTimer, setShowTimer] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  const selectedBg = backgrounds.find((bg) => bg.id === currentBackground)?.image || "";
  const videoRef = useRef(null);


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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.contentWindow.postMessage(
        `{"event":"command","func":"setVolume","args":[${videoMuted ? "0" : videoVolume}]}`,
        "*"
      );
    }
  }, [videoMuted, videoVolume]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const getEmbeddedVideoUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=${videoMuted ? "1" : "0"}&enablejsapi=1`
      : "";
  };
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {videoUrl ? (
        <iframe
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
          src={getEmbeddedVideoUrl(videoUrl)}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${selectedBg})` }}
        />
      )}

      <div className="relative z-10 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mt-6">
          Study Timer
        </h1>

        <div className="bg-black bg-opacity-50 text-white text-lg sm:text-xl font-semibold px-6 py-4 rounded-lg shadow-lg text-center mt-6">
          {currentQuote}
        </div>

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
          {showBackgroundSelector && <BackgroundSelector />}

          {videoUrl && (
            <>
              <button
                onClick={() => dispatch(toggleVideoMute())}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
              >
                {videoMuted ? "Unmute Video" : "Mute Video"}
              </button>

              {!videoMuted && (
                <div className="flex flex-col items-center mt-2">
                  <label className="text-sm font-medium">Volume: {videoVolume}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={videoVolume}
                    onChange={(e) => dispatch(setVideoVolume(Number(e.target.value)))}
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="fixed top-4 left-4 flex flex-col space-y-4">
          <button
            onClick={() => setShowTimer(!showTimer)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Timer
          </button>
          {showTimer && <Timer />}

          <button
            onClick={() => setShowSessionStats(!showSessionStats)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Session Stats
          </button>
          {showSessionStats && <SessionStats />}
        </div>

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
