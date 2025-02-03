import { createSlice } from "@reduxjs/toolkit";
import defaultBg from "../assets/default.jpg";
import forestBg from "../assets/forest.jpg";
import oceanBg from "../assets/ocean.jpg";
import sunsetBg from "../assets/sunset.jpg";

const initialState = {
  currentBackground: "default",
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
    },
  },
});

export const { setBackground } = backgroundSlice.actions;
export const selectCurrentBackground = (state) => state.background.currentBackground;
export const selectBackgrounds = (state) => state.background.backgrounds;

export default backgroundSlice.reducer;
