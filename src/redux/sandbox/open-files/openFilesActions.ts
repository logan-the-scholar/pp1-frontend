import { OpenTabsRepository } from '@/services/database/OpenTabsRepository';
import { AppThunk } from "../../store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import OpenTabsSlice from "./OpenTabsSlice";
import { DeclaredNodeModel, FileMetaData, OpenFile } from "@/types/ReduxState.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from '@/types/enum/ApiStatus.enum';
import FileType from '@/types/enum/FileType';

function open(node: DeclaredNodeModel<FileMetaData>): AppThunk {
    return (async (dispatch, getState) => {

        if (node.droppable) {
            return;
        }

        const state = getState();
        const alreadyOpenNode = state.OPEN_FILES.open.find((n) => n.id === node.id);

        if (alreadyOpenNode === undefined) {
            // const previousEditedFile = state.OPEN_FILES.open.find((n) => n.data?.edited === false);
            const previousEditedFile = state.OPEN_FILES.open.find(o =>
                state.FILE_TREE.tree.find(f => o.id === f.id)?.data.edited === false
            );

            dispatch(OpenTabsSlice.actions.add(node.id.toString()));

            if (previousEditedFile !== undefined) {
                dispatch(OpenTabsSlice.actions.close(previousEditedFile.id));
            }

            dispatch(selectAndSave({ id: node.id, saved: node.data.saved || true, edited: node.data.edited || true }));

        } else {
            dispatch(selectAndSave(alreadyOpenNode));
        }

    });

}


function closeAndChangeWindow(id: string): AppThunk {
    return (async (dispatch, getState) => {
        const index: number = getState().OPEN_FILES.open.findIndex((n) => n.id === id);
        if (index !== -1) {

            new OpenTabsRepository().remove(getState().OPEN_FILES.open[index].id.toString());

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

            } else {
                dispatch(OpenTabsSlice.actions.unSelect());

            }
        }
    });
}


function selectAndSave(node: { id: string | number, edited?: boolean, saved?: boolean }): AppThunk {
    return (async (dispatch, getState) => {

        const projectId = getState().FILE_TREE.project;

        if (projectId !== undefined) {
            const isAddedNode = getState().OPEN_FILES.open.some(o => o.id === node.id)

            if (!isAddedNode) {
                throw new ErrorHelper("State not found", "tried to access a file instance before it was added");

            }

            const foundNode = getState().FILE_TREE.tree.find(n => n.id === node.id);

            if (!foundNode) {
                dispatch(OpenTabsAction.closeAndChangeWindow(node.id.toString()));
                throw new ErrorHelper("???", `Removing file <${node.id}> from state due to not existing in file tree`);

            }

            if (foundNode.data.extension === FileType.FOLDER) {
                throw new ErrorHelper("???", "Can't open a folder in the code editor!");

            } else {

                dispatch(OpenTabsSlice.actions.select(node.id.toString()));
                dispatch(FileTreeSlice.actions.select({ id: node.id }));

                const repository = new OpenTabsRepository();
                repository.saveOpen(getState().OPEN_FILES.open, projectId);
                repository.saveSelected(node.id.toString(), projectId);
            }

        } else {
            throw new ErrorHelper(ApiStatusEnum.STATE_NOT_FOUND, "Project id cant be found, must be set before trying to access the storage");

        }

    });
}

export const OpenTabsAction = { open, closeAndChangeWindow };