import { Repository } from "@/services/database/FileRepository";
import { AppThunk } from "../../store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import openFilesSlice from "./openFilesSlice";
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData } from "@/types/state-types";

function open(node: DeclaredNodeModel<FileMetaData> | DeclaredNodeModel<OpenFileMetaData>): AppThunk {
    return (async (dispatch, getState) => {

        const state = getState();
        const alreadyOpenNode = state.OPEN_FILES.open.find((n) => n.id === node.id);

        if (alreadyOpenNode === undefined) {
            const previousEditedFile = state.OPEN_FILES.open.find((n) => n.data?.edited === false);

            dispatch(openFilesSlice.actions.add(node));
            if (previousEditedFile !== undefined) {
                dispatch(openFilesSlice.actions.close(previousEditedFile.id));
            }

            dispatch(openFilesSlice.actions.select({ id: node.id, saved: true, edited: true }));

            await new Repository().save3({
                id: node.id as string,
                line: 1,
                column: 1,
                isSaved: true
            });

        } else {
            dispatch(openFilesSlice.actions.select(alreadyOpenNode));

        }
    });

}


const closeAndChangeWindow = (id: string | number): AppThunk => (dispatch, getState) => {
    const index: number = getState().OPEN_FILES.open.findIndex((n) => n.id === id);

    dispatch(openFilesSlice.actions.close(id));

    const state = getState();
    if (state.OPEN_FILES.open.length > 0) {

        const otherNode = state.OPEN_FILES.open.at(index - 1);
        if (otherNode) {
            dispatch(openFilesSlice.actions.select({ id: otherNode.id }));
            dispatch(FileTreeSlice.actions.select(otherNode.id));

        }

        const tryOtherNode = state.OPEN_FILES.open.at(index);
        if (tryOtherNode) {
            dispatch(openFilesSlice.actions.select({ id: tryOtherNode.id }));
            dispatch(FileTreeSlice.actions.select(tryOtherNode.id));

        }
    }
}

export const OpenFilesAction = { open, closeAndChangeWindow };