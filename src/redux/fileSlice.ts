import { FileMetaData } from '@/features/sandbox/FileViewer';
import { NodeModel } from '@minoru/react-dnd-treeview';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//TODO leer desde localStorage junto con un array de archivos abiertos, para permanencia de sesion
const initialState: NodeModel<FileMetaData> = {
    id: '',
    parent: '',
    text: ''
};

const fileSlice = createSlice({
    name: 'actualFile',
    initialState,
    reducers: {
        set(state, action: PayloadAction<NodeModel<FileMetaData>>) {
            state.id = action.payload.id;
            state.parent = action.payload.parent;
            state.text = action.payload.text;
            state.data = action.payload.data;
        },
        clear(state) {
            state.id = '';
            state.parent = '';
            state.text = '';
            state.data = undefined;
        },
    },
});

export const { set, clear } = fileSlice.actions;
export default fileSlice.reducer;