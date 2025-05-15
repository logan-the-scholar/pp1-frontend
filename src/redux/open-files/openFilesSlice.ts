import FileType from '@/types/enum/FileType';
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData, openFilesType } from '@/types/state-types';
import { NodeModel } from '@minoru/react-dnd-treeview';
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

        select(state, action: PayloadAction<DeclaredNodeModel<OpenFileMetaData>>) {
            if (action.payload.data?.fileType !== FileType.FOLDER) {
                if (action.payload.data?.edited === undefined && action.payload.data?.saved === undefined) {
                    state.selected = {
                        id: action.payload.id,
                        parent: action.payload.parent,
                        text: action.payload.text,
                        data: {
                            ...action.payload.data ,
                            edited: true,
                            saved: true
                        }
                    }

                } else {
                    state.selected = {
                        id: action.payload.id,
                        parent: action.payload.parent,
                        text: action.payload.text,
                        data: {
                            ...action.payload.data
                        }
                    }

                }

            }
        },

        add(state, action: PayloadAction<DeclaredNodeModel<FileMetaData> | DeclaredNodeModel<OpenFileMetaData>>) {

            state.open.splice(state.open.findIndex((n) => n.id === state.selected?.id) + 1 || 0, 0, {
                ...action.payload, data: {
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