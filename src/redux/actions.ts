import { FileMetaData } from "@/features/sandbox/FileViewer";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { AppThunk, RootState } from "./store";
import threeSlice from "./threeSlice";
import fileSlice from "./fileSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import FileType from "@/types/enum/FileType";

export const createAndOpenNode = (node: NodeModel<FileMetaData>): AppThunk => (dispatch, getState) => {
    dispatch(threeSlice.actions.createNode(node));

    const state = getState();

    const createdNode = state.three.find((node_) => node_.id === node.id);

    if(createdNode) {
        dispatch(fileSlice.actions.set(createdNode));
    }
};

export const createNodeAndOpen = createAsyncThunk("three/createAndOpenNode",
    async (payload: NodeModel<FileMetaData>, { dispatch, getState }) => {
        dispatch(threeSlice.actions.createNode(payload));

        const state = getState() as RootState;

        const createdNode = state.three.find((node) => node.id === payload.id);

        if (createdNode && payload.data?.fileType !== FileType.FOLDER) {
            dispatch(fileSlice.actions.set(createdNode));
        }
    }
);