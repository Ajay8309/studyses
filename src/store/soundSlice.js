import { createSlice } from "@reduxjs/toolkit";
import lofi from "../assets/audio/lofi.mp3"
import liabrary from "../assets/audio/liabrary.mp3"
import rain from "../assets/audio/rain.mp3"
import nature from "../assets/audio/nature.mp3"

const initialState = {
    sounds: [
      { id: "lofi", name: "LoFi beats", src: lofi, volume: 0.5, playing: false },
      { id: "nature", name: "Nature sounds", src: liabrary, volume: 0.5, playing: false },
      { id: "rain", name: "Rain sounds", src: rain, volume: 0.5, playing: false },
      { id: "library", name: "Library ambience", src: nature, volume: 0.5, playing: false },
    ],
  };
  

export const soundSlice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    togglePlay: (state, action) => {
      const sound = state.sounds.find((s) => s.id === action.payload);
      if (sound) sound.playing = !sound.playing;
    },
    setVolume: (state, action) => {
      const { id, volume } = action.payload;
      const sound = state.sounds.find((s) => s.id === id);
      if (sound) sound.volume = volume;
    },
  },
});

export const { togglePlay, setVolume } = soundSlice.actions;
export const selectSounds = (state) => state.sound.sounds;

export default soundSlice.reducer;
