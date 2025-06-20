import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import projectLoadStatusSlice from './dashboard/projectLoadStatusSlice';
import treeSlice from './sandbox/file-tree/treeSlice';
import openFilesSlice from './sandbox/open-files/openFilesSlice';

export const store = configureStore({
  reducer: {
    OPEN_FILES: openFilesSlice.reducer,
    FILE_TREE: treeSlice.reducer,
    PROJECT_LOAD_STATUS: projectLoadStatusSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;