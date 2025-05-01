import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './fileSlice';
import threeReducer from "./threeSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer,
    three: threeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;