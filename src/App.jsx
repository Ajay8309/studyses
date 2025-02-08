import { Provider } from "react-redux";
import { store } from "./store/store";
import Timer from "./components/Timer";
import BackgroundSelector from "./components/BackgroundSelector";
import SessionStats from "./components/SessionStats";
import SoundPlayer from "./components/SoundPlayer";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState, useEffect, useRef, useCallback } from "react";

import { 
  selectCurrentBackground, 
  selectBackgrounds, 
  selectVideoUrl, 
  selectVideoMuted, 
  toggleVideoMute, 
  selectVideoVolume, 
  setVideoVolume 
} from "./store/backgroundSlice";

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
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const videoRef = useRef(null);

  const selectedBg = backgrounds.find((bg) => bg.id === currentBackground)?.image || "";

  // console.log(sessions);

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
      setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, [quotes]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await loadSessionHistory(user.uid);
      } else {
        setSessions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSessions([]);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const loadSessionHistory = useCallback(async (userId) => {
    try {
      const docRef = doc(db, "sessions", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSessions(docSnap.data().history || []);
      } else {
        await setDoc(docRef, { history: [] });
      }
    } catch (error) {
      console.error("Error loading session history:", error);
    }
  }, []);

  const saveSession = useCallback(async (session) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "sessions", user.uid), {
        history: arrayUnion(session),
      });
      setSessions((prevSessions) => [...prevSessions, session]);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }, [user]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error enabling full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      {videoUrl ? (
        <iframe
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
          src={videoUrl}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: `url(${selectedBg})` }} />
      )}

      <div className="relative z-10 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mt-6">Study Timer</h1>

        <div className="bg-black bg-opacity-50 text-white text-lg sm:text-xl font-semibold px-6 py-4 rounded-lg shadow-lg text-center mt-6">
          {currentQuote}
        </div>

        {!user ? (
          <div className="flex justify-center items-center min-h-screen">
            <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg">
              Sign in with Google
            </button>
          </div>
        ) : (
          <>
            <div className="fixed top-4 right-4 flex flex-col space-y-4">
              <button onClick={toggleFullScreen} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
                Fullscreen
              </button>

              <button onClick={() => setShowBackgroundSelector(!showBackgroundSelector)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Background
              </button>
              {showBackgroundSelector && <BackgroundSelector />}

              {videoUrl && (
                <>
                  <button onClick={() => dispatch(toggleVideoMute())} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
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
              <button onClick={() => setShowTimer(!showTimer)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Timer
              </button>
              {showTimer && <Timer saveSession={saveSession} />}

              <button onClick={() => setShowSessionStats(!showSessionStats)} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
                Session Stats
              </button>
              {showSessionStats && <SessionStats sessions={sessions} />}
            </div>

            <div className="fixed bottom-4 left-4">
              <SoundPlayer />
            </div>

            <button onClick={handleLogout} className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          </>
        )}
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
