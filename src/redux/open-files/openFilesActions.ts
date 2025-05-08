import { NodeModel } from "@minoru/react-dnd-treeview";
import { AppThunk } from "../store";
import openFilesSlice from "./openFilesSlice";
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData } from "@/types/state-types";
import treeSlice from "../file-tree/treeSlice";

const open = (node: DeclaredNodeModel<FileMetaData> | DeclaredNodeModel<OpenFileMetaData>): AppThunk => (dispatch, getState) => {
    const state = getState();

    if (state.OPEN_FILES.open.find((n) => n.id === node.id) === undefined) {
        const previousEditedFile = state.OPEN_FILES.open.find((n) => n.data?.edited === false);

        if (previousEditedFile !== undefined) {
            dispatch(openFilesSlice.actions.close(previousEditedFile.id));
        }

        dispatch(openFilesSlice.actions.add(node));

    } else {
        dispatch(openFilesSlice.actions.select({
            ...node,
            data: {
                saved: true,
                edited: false,
                ...node.data as FileMetaData | OpenFileMetaData
            }
        }));

    }
}

const closeAndChangeWindow = (id: string | number): AppThunk => (dispatch, getState) => {
    const index: number = getState().OPEN_FILES.open.findIndex((n) => n.id === id);

    dispatch(openFilesSlice.actions.close(id));

    const state = getState();
    if (state.OPEN_FILES.open.length > 0) {

        const otherNode = state.OPEN_FILES.open.at(index - 1);
        if (otherNode) {
            dispatch(openFilesSlice.actions.select(otherNode));
            dispatch(treeSlice.actions.select(otherNode));

        }

        const tryOtherNode = state.OPEN_FILES.open.at(index);
        if (tryOtherNode) {
            dispatch(openFilesSlice.actions.select(tryOtherNode));
            dispatch(treeSlice.actions.select(tryOtherNode));

        }
    }
}

export const openFilesAction = { open, closeAndChangeWindow };