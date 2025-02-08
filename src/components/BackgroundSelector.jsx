import { useDispatch, useSelector } from "react-redux";
import { setBackground, setVideoUrl, toggleVideoMute, setVideoVolume, selectCurrentBackground, selectBackgrounds, selectVideoUrl, selectVideoMuted, selectVideoVolume } from "../store/backgroundSlice";
import { useState } from "react";
import React from "react";


export default function BackgroundSelector() {
  const dispatch = useDispatch();
  const currentBackground = useSelector(selectCurrentBackground);
  const backgrounds = useSelector(selectBackgrounds);
  const videoUrl = useSelector(selectVideoUrl);
  const videoMuted = useSelector(selectVideoMuted);
  const videoVolume = useSelector(selectVideoVolume);
  const [inputUrl, setInputUrl] = useState("");

  const handleSetVideo = () => {
    if (inputUrl.trim() !== "") {
      dispatch(setVideoUrl(inputUrl));
      setInputUrl(""); 
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm mt-2">
      <h3 className="text-lg font-semibold mb-4">Background Theme</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => dispatch(setBackground(bg.id))}
            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
              currentBackground === bg.id ? "border-blue-500" : "border-transparent"
            } transition`}
          >
            <img src={bg.image} alt={bg.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Enter YouTube URL"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSetVideo}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Set Video Background
        </button>

        {videoUrl && (
          <>
            <button
              onClick={() => dispatch(toggleVideoMute())}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md"
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
    </div>
  );
}
