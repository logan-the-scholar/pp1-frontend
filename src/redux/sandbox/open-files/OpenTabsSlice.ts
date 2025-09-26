import { RootState } from '@/redux/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const openTabsAdapter = createEntityAdapter<string, string>({
    selectId: (file) => file
});

const initialState = openTabsAdapter.getInitialState();

const OpenTabsSlice = createSlice({
    name: 'OPEN_FILES',
    initialState,
    reducers: {
        createStore: openTabsAdapter.addMany,
        add: openTabsAdapter.addOne,
        close: openTabsAdapter.removeOne,
    }

});

export const OpenTabsSelectors = openTabsAdapter.getSelectors((state: RootState) => state.OPEN_FILES);

export default OpenTabsSlice;