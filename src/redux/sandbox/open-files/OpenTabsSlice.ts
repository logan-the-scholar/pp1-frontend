import { OpenFilesType } from '@/types/ReduxState.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: OpenFilesType = {
    selected: undefined,
    open: []
};

const OpenTabsSlice = createSlice({
    name: 'OPEN_FILES',
    initialState,
    reducers: {

        createStore(state, action: PayloadAction<OpenFilesType>) {
            state.selected = action.payload.selected;
            state.open = action.payload.open;
        },

        /** Select an already-added node showing the relative content in the monaco editor
         *  (must be executed next to `openFilesSlice.add()` action) 
         * */
        select(state, action: PayloadAction<string>) {
            state.selected = {
                id: action.payload,
            };
            // if (foundNode.data.extension !== FileType.FOLDER) {
            //     if (action.payload.edited === undefined && action.payload.saved === undefined) {
            //         state.selected = {
            //             ...foundNode,
            //             data: {
            //                 ...foundNode.data,
            //                 edited: true,
            //                 saved: true
            //             }
            //         }

            //     } else {
            //         state.selected = {
            //             ...foundNode,
            //             data: {
            //                 ...foundNode.data,
            //                 edited: action.payload.edited as boolean,
            //                 saved: action.payload.saved as boolean
            //             }
            //         }

            //     }

            // }
            // }
        },

        add(state, action: PayloadAction<string>) {
            state.open.splice(state.open.findIndex((n) => n.id === state.selected?.id) + 1 || 0, 0, {
                id: action.payload
            });
        },

        close(state, action: PayloadAction<string>) {
            const index = state.open.findIndex((n) => n.id === action.payload);

            index >= 0 && state.open.splice(index, 1);
        },

        unSelect(state, action: PayloadAction<void>) {
            state.selected = undefined;
        }
    }

});

export default OpenTabsSlice;