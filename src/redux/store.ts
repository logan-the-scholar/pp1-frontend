import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import openFilesSlice from './sandbox/open-files/openFilesSlice';
import FileTreeSlice from './sandbox/file-tree/FileTreeSlice';

export const store = configureStore({
  reducer: {
    OPEN_FILES: openFilesSlice.reducer,
    FILE_TREE: FileTreeSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;