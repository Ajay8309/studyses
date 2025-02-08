import { createSlice } from "@reduxjs/toolkit";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const initialState = {
  sessions: [],
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessions: (state, action) => {
      state.sessions = action.payload;
    },
    addSession: (state, action) => {
      state.sessions.push(action.payload);
    },
  },
});

export const { setSessions, addSession } = sessionSlice.actions;

// ** Load sessions from Firestore **
export const loadSessionsFromDB = () => async (dispatch) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "sessions", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      dispatch(setSessions(docSnap.data().history || []));
    }
  } catch (error) {
    console.error("Error loading session history:", error);
  }
};

// ** Save session to Firestore **
export const saveSessionToDB = (session) => async (dispatch) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const docRef = doc(db, "sessions", user.uid);
    const docSnap = await getDoc(docRef);
    const previousSessions = docSnap.exists() ? docSnap.data().history : [];

    const updatedSessions = [...previousSessions, session];

    await setDoc(docRef, { history: updatedSessions });

    dispatch(addSession(session));
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export default sessionSlice.reducer;
