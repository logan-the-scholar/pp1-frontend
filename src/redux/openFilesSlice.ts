import FileType from '@/types/enum/FileType';
import { FileMetaData, OpenFileMetaData } from '@/types/state-types';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//TODO leer desde localStorage junto con un array de archivos abiertos, para permanencia de sesion, manejar un isEdited y un preview

type openFilesType = {
    selected: NodeModel<OpenFileMetaData> | undefined,
    open: NodeModel<OpenFileMetaData>[]
}

const initialState: openFilesType = {
    selected: undefined,
    open: []
};

const openFilesSlice = createSlice({
    name: 'OPEN_FILES',
    initialState,
    reducers: {

        select(state, action: PayloadAction<NodeModel<OpenFileMetaData>>) {
            if (action.payload.data?.fileType !== FileType.FOLDER) {

                if (action.payload.data?.edited === undefined && action.payload.data?.saved === undefined) {
                    state.selected = {
                        id: action.payload.id,
                        parent: action.payload.parent,
                        text: action.payload.text,
                        data: {
                            ...action.payload.data as FileMetaData & { edited: boolean, saved: boolean },
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
                            ...action.payload.data as FileMetaData & { edited: boolean, saved: boolean }
                        }
                    }

                }

            }
        },

        addOrReplaceFile(state, action: PayloadAction<NodeModel<FileMetaData> | NodeModel<OpenFileMetaData>>) {
            state.open.splice(state.open.findIndex((n) => n.id === state.selected?.id) + 1 || 0, 0, {
                ...action.payload, data: {
                    edited: false,
                    saved: true,
                    ...action.payload.data as FileMetaData
                }
            });
        },

        close(state, action: PayloadAction<string>) {

        },

        setEdited(state, action: PayloadAction<{ id: string, edited: boolean }>) {

        },

        setSaved(state, action: PayloadAction<{ id: string, edited: boolean } | Map<string, boolean>>) {

        }
    }

});

export default openFilesSlice;