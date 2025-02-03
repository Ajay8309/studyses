import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import backgroundReducer from './backgroundSlice';
import soundReducer from './soundSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    background: backgroundReducer,
    sound:soundReducer
  },
});