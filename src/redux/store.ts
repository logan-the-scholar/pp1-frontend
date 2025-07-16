import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import OpenTabsSlice from './sandbox/open-files/OpenTabsSlice';
import FileTreeSlice from './sandbox/file-tree/FileTreeSlice';

export const store = configureStore({
  reducer: {
    OPEN_FILES: OpenTabsSlice.reducer,
    FILE_TREE: FileTreeSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;