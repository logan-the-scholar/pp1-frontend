import FileType from '@/types/enum/FileType';
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData, openFilesType } from '@/types/state-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//TODO leer desde localStorage

const initialState: openFilesType = {
    selected: undefined,
    open: []
};

const openFilesSlice = createSlice({
    name: 'OPEN_FILES',
    initialState,
    reducers: {

        /** Select an already-added node showing the relative content in the monaco editor
         *  (must be executed next to `openFilesSlice.add()` action) 
         * omits folders to be opened
         * */
        select(state, action: PayloadAction<{ id: string | number, edited?: boolean, saved?: boolean }>) {
            const foundNode = state.open.find((n) => n.id === action.payload.id);

            if (foundNode === undefined) {
                throw new Error("");

            } else {

                if (foundNode.data.fileType !== FileType.FOLDER) {
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

        edit(state, action: PayloadAction<{ id: string | number, code: string, line: number, edited: boolean }>) {
            const index = state.open.findIndex((n) => n.id === action.payload.id);
            const editedData: OpenFileMetaData = {
                ...state.open[index].data,
                content: action.payload.code,
                edited: action.payload.edited,
                line: action.payload.line
            };

            state.open[index].data = editedData;

            if (state.selected) {
                state.selected.data = editedData;
            }
        },

        setSaved(state, action: PayloadAction<{ id: string, edited: boolean } | Map<string, boolean>>) {

        }
    }

});

export default openFilesSlice;