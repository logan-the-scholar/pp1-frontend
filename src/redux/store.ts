import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import fileReducer from './open-files/openFilesSlice';
import threeReducer from "./file-tree/treeSlice";

export const store = configureStore({
  reducer: {
    OPEN_FILES: fileReducer.reducer,
    FILE_TREE: threeReducer.reducer,
  }  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;