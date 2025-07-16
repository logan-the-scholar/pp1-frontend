import { ErrorHelper } from '@/helpers/ErrorHelper';
import FileType from '@/types/enum/FileType';
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData, OpenFilesType } from '@/types/state-types';
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
         * omits folders to be opened
         * */
        select(state, action: PayloadAction<{ id: string | number, edited?: boolean, saved?: boolean }>) {
            const foundNode = state.open.find((n) => n.id === action.payload.id);

            if (foundNode === undefined) {
                throw new ErrorHelper("State not found", "tried to access a file instance before it was added");

            } else {

                if (foundNode.data.extension !== FileType.FOLDER) {
                    if (action.payload.edited === undefined && action.payload.saved === undefined) {
                        state.selected = {
                            ...foundNode,
                            data: {
                                ...foundNode.data,
                                edited: true,
                                saved: true
                            }
                        }

                    } else {
                        state.selected = {
                            ...foundNode,
                            data: {
                                ...foundNode.data,
                                edited: action.payload.edited as boolean,
                                saved: action.payload.saved as boolean
                            }
                        }

                    }

                }
            }
        },

        add(state, action: PayloadAction<DeclaredNodeModel<FileMetaData> | DeclaredNodeModel<OpenFileMetaData>>) {

            state.open.splice(state.open.findIndex((n) => n.id === state.selected?.id) + 1 || 0, 0, {
                ...action.payload,
                data: {
                    edited: false,
                    saved: true,
                    ...action.payload.data
                }
            });
        },

        close(state, action: PayloadAction<string | number>) {
            const index = state.open.findIndex((n) => n.id === action.payload);

            index >= 0 && state.open.splice(index, 1);
        },

        edit(state, action: PayloadAction<{ id: string | number, code: string | undefined, line: number, edited: boolean }>) {
            const index = state.open.findIndex((n) => n.id === action.payload.id);
            const editedData: OpenFileMetaData = {
                ...state.open[index].data,
                content: action.payload.code,
                saved: false,
                edited: action.payload.edited,
                line: action.payload.line
            };

            state.open[index].data = editedData;

            if (state.selected) {
                state.selected.data = editedData;
            }
        },

        changeSaved(state, action: PayloadAction<{ one?: { id: string | number, saved: boolean }, two?: Map<string, boolean> }>) {

            if (action.payload.one) {
                const index = state.open.findIndex((n) => n.id === action.payload.one?.id);
                state.open[index].data.saved = action.payload.one.saved;

            } else if (action.payload.two) {

            }
        }
    }

});

export default OpenTabsSlice;