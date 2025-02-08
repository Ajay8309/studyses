import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  duration: 25 * 60,
  timeLeft: 25 * 60,
  isRunning: false,
  sessions: [],
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setDuration: (state, action) => {
      if (!state.isRunning) {
        state.duration = action.payload;
        state.timeLeft = action.payload; 
      }
    },
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.timeLeft = state.duration;
      state.isRunning = false;
    },
    tick: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    },
    completeSession: (state) => {
      state.sessions.push({
        duration: state.duration,
        completedAt: new Date().toISOString(),
      });
      state.timeLeft = state.duration;
      state.isRunning = false;
    },
  },
});

export const { setDuration, startTimer, pauseTimer, resetTimer, tick, completeSession } =
  timerSlice.actions;

export default timerSlice.reducer;
