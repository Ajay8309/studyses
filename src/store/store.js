import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './timerSlice';
import backgroundReducer from './backgroundSlice';
import soundReducer from './soundSlice';
import sessionSlice from './sessionSlice';
import todoSlice from './todoSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    background: backgroundReducer,
    sound:soundReducer,
    session:sessionSlice,
    todos:todoSlice
  },
});