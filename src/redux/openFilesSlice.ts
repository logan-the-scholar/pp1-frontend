import FileType from '@/types/enum/FileType';
import { FileMetaData } from '@/types/FileMetadata.type';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//TODO leer desde localStorage junto con un array de archivos abiertos, para permanencia de sesion, manejar un isEdited y un preview
const initialState: NodeModel<FileMetaData> = {
    id: '',
    parent: '',
    text: ''
};

const openFilesSlice = createSlice({
    name: 'OPEN_FILES',
    initialState,
    reducers: {
        set(state, action: PayloadAction<NodeModel<FileMetaData>>) {
            if(state.data?.fileType !== FileType.FOLDER) {
                state.id = action.payload.id;
                state.parent = action.payload.parent;
                state.text = action.payload.text;
                state.data = action.payload.data;
            }
        },
        clear(state) {
            state.id = '';
            state.parent = '';
            state.text = '';
            state.data = undefined;
        },
    },
});

export default openFilesSlice;