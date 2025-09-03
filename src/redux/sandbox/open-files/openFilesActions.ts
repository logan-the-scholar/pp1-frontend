import { OpenTabsRepository } from '@/services/database/OpenTabsRepository';
import { AppDispatch, AppThunk, RootState } from "../../store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import OpenTabsSlice from "./OpenTabsSlice";
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData } from "@/types/state-types";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from '@/types/enum/ApiStatus.enum';
import { createAsyncThunk } from '@reduxjs/toolkit';

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

            dispatch(selectAndSave({ id: node.id, saved: true, edited: true }));

        } else {
            dispatch(selectAndSave(alreadyOpenNode));
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
                    dispatch(selectAndSave({ id: leftNode.id }));

                }

                const rightNode = state.OPEN_FILES.open.at(index);
                if (rightNode) {
                    dispatch(selectAndSave({ id: rightNode.id }));

                }
            }
        }
    });
}


function selectAndSave(node: { id: string | number, edited?: boolean, saved?: boolean }): AppThunk {
    return (async (dispatch, getState) => {

        const projectId = getState().FILE_TREE.project;

        if (projectId !== undefined) {

            //TODO esto se puede usar como clase? yo creo que si, en tal caso usar herencia para facilitar algunos campos que 
            //TODO no tengan muchos cambios, para evitar el exceso de parametros y de llamadas innecesarias a getState()

            dispatch(OpenTabsSlice.actions.select(node));
            dispatch(FileTreeSlice.actions.select({ id: node.id }));

            const repository = new OpenTabsRepository();
            repository.save(getState().OPEN_FILES.open, projectId);
            repository.saveSelected(node.id.toString(), projectId);

        } else {
            throw new ErrorHelper(ApiStatusEnum.STATE_NOT_FOUND, "Project id cant be found, must be set before trying to access the storage");

        }

    });
}

export const OpenTabsAction = { open, closeAndChangeWindow,  };