import { createSlice } from "@reduxjs/toolkit";
import defaultBg from "../assets/default.jpg";
import forestBg from "../assets/forest.jpg";
import oceanBg from "../assets/ocean.jpg";
import sunsetBg from "../assets/sunset.jpg";

const initialState = {
  currentBackground: "default",
  videoUrl: "", 
  videoMuted: true, 
  videoVolume: 50,
  backgrounds: [
    { id: "default", name: "Default", image: defaultBg },
    { id: "forest", name: "Forest", image: forestBg },
    { id: "ocean", name: "Ocean", image: oceanBg },
    { id: "sunset", name: "Sunset", image: sunsetBg },
  ],
};

export const backgroundSlice = createSlice({
  name: "background",
  initialState,
  reducers: {
    setBackground: (state, action) => {
      state.currentBackground = action.payload;
      state.videoUrl = ""; 
    },
    setVideoUrl: (state, action) => {
      state.videoUrl = action.payload;
      state.currentBackground = "";
    },
    toggleVideoMute: (state) => {
      state.videoMuted = !state.videoMuted;
    },
    setVideoVolume: (state, action) => {
      state.videoVolume = action.payload; 
    },
  },
});

export const { setBackground, setVideoUrl, toggleVideoMute, setVideoVolume } = backgroundSlice.actions;

export const selectCurrentBackground = (state) => state.background.currentBackground;
export const selectBackgrounds = (state) => state.background.backgrounds;
export const selectVideoUrl = (state) => state.background.videoUrl;
export const selectVideoMuted = (state) => state.background.videoMuted;
export const selectVideoVolume = (state) => state.background.videoVolume; 

export default backgroundSlice.reducer;
