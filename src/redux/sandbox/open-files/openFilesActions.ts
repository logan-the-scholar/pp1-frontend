import { OpenTabsRepository } from '@/services/database/OpenTabsRepository';
import { AppThunk } from "../../store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import OpenTabsSlice from "./OpenTabsSlice";
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData } from "@/types/state-types";
import { ErrorHelper } from "@/helpers/ErrorHelper";

function open(node: DeclaredNodeModel<FileMetaData> | DeclaredNodeModel<OpenFileMetaData>): AppThunk {
    return (async (dispatch, getState) => {

        const state = getState();
        const alreadyOpenNode = state.OPEN_FILES.open.find((n) => n.id === node.id);

        if (alreadyOpenNode === undefined) {
            const previousEditedFile = state.OPEN_FILES.open.find((n) => n.data?.edited === false);

            dispatch(OpenTabsSlice.actions.add(node));

            if (previousEditedFile !== undefined) {
                dispatch(OpenTabsSlice.actions.close(previousEditedFile.id));
            }

            dispatch(openAndSave({ id: node.id, saved: true, edited: true }));

        } else {
            dispatch(openAndSave(alreadyOpenNode));
        }

    });

}


function closeAndChangeWindow(id: string | number): AppThunk {
    return (async (dispatch, getState) => {
        const index: number = getState().OPEN_FILES.open.findIndex((n) => n.id === id);
        if (index !== -1) {

            dispatch(OpenTabsSlice.actions.close(id));

            const state = getState();
            if (state.OPEN_FILES.open.length > 0) {

                const leftNode = state.OPEN_FILES.open.at(index - 1);
                if (leftNode) {
                    dispatch(openAndSave({ id: leftNode.id }));

                }

                const rightNode = state.OPEN_FILES.open.at(index);
                if (rightNode) {
                    dispatch(openAndSave({ id: rightNode.id }));

                }
            }
        }
    });
}


function openAndSave(node: { id: string | number, edited?: boolean, saved?: boolean }): AppThunk {
    return (async (dispatch, getState) => {

        const projectId = getState().FILE_TREE.project;

        if (projectId !== undefined) {

            dispatch(OpenTabsSlice.actions.select(node));
            dispatch(FileTreeSlice.actions.select({ id: node.id }));

            await new OpenTabsRepository().save(getState().OPEN_FILES, projectId);

        } else {
            throw new ErrorHelper("State not found", "Project uuid reference is null");

        }

    });
}

export const OpenTabsAction = { open, closeAndChangeWindow };