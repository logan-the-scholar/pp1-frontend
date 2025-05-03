import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import fileReducer from './fileSlice';
import threeReducer from "./threeSlice";

export const store = configureStore({
  reducer: {
    file: fileReducer.reducer,
    three: threeReducer.reducer,
  }  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;