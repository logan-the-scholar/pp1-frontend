import { OpenTabsRepository } from '@/services/database/OpenTabsRepository';
import { AppThunk } from "../../store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import OpenTabsSlice, { OpenTabsSelectors } from "./OpenTabsSlice";
import { DeclaredNodeModel, FileMetaData } from "@/types/ReduxState.type";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from '@/types/enum/ApiStatus.enum';
import FileType from '@/types/enum/FileType';
import { DbFileTabType } from '@/types/Database.type';
import ProjectMetaSlice from '../project-meta/ProjectMetaSlice';
import { ProjectMetaActions } from '../project-meta/ProjectMetaActions';

function open(node: DeclaredNodeModel<FileMetaData>): AppThunk {
    return (async (dispatch, getState) => {

        if (node.droppable) {
            return;
        }

        const state = getState();

        const openFileId = state.OPEN_FILES.entities[node.id];
        console.log(openFileId);
        const alreadyOpenNode = state.FILE_TREE.entities[openFileId];
        console.log(alreadyOpenNode);

        if (alreadyOpenNode === undefined) {
            // const prevUneditedFile = state.FILE_TREE.entities.find((n) => n.data?.edited === false);
            // const prevUneditedFile = FileTreeSelectors.selectAll(getState()).find(f => getState().OPEN_FILES)
            const prevUneditedId = state.OPEN_FILES.ids.find(o => state.FILE_TREE.entities[o].data.edited === false);
            // const prevUneditedFile = state.OPEN_FILES.open.find(o =>
            //     state.FILE_TREE.tree.find(f => o.id === f.id)?.data.edited === false
            // );

            dispatch(OpenTabsSlice.actions.add(node.id.toString()));

            if (prevUneditedId !== undefined) {
                const prevUneditedFile = state.FILE_TREE.entities[prevUneditedId];
                dispatch(close(prevUneditedFile.id.toString()));
            }
            dispatch(selectAndPersist({ id: node.id, saved: node.data.saved || true, edited: node.data.edited || false }));

        } else {
            dispatch(selectAndPersist({ ...alreadyOpenNode, persistOpen: false }));
        }

    });

}


function closeAndChangeWindow(id: string): AppThunk {
    return (async (dispatch, getState) => {
        const index: number = getState().OPEN_FILES.ids.findIndex((n) => n === id);

        if (index !== -1) {

            dispatch(close(id));
            // new OpenTabsRepository().remove(getState().OPEN_FILES.open[index].id.toString());

            // dispatch(OpenTabsSlice.actions.close(id));
            // dispatch(FileTreeSlice.actions.unedit(id));

            const openTabs = OpenTabsSelectors.selectAll(getState());
            if (openTabs.length > 0) {

                const leftNode = openTabs.at(index - 1);
                if (leftNode) {
                    dispatch(selectAndPersist({ id: leftNode, persistOpen: false }));
                }

                const rightNode = openTabs.at(index);
                if (rightNode) {
                    dispatch(selectAndPersist({ id: rightNode, persistOpen: false }));
                }

            } else {
                dispatch(ProjectMetaSlice.actions.select());
                const pId = getState().PROJECT_META.project;
                if (pId) {
                    new OpenTabsRepository().unSelect(pId);
                }
            }
        }
    });
}


function close(id: string): AppThunk {
    return (async (dispatch, getState) => {
        new OpenTabsRepository().remove(id);
        dispatch(OpenTabsSlice.actions.close(id));
        dispatch(FileTreeSlice.actions.unedit(id));
    });
}


function selectAndPersist(node: { id: string | number, edited?: boolean, saved?: boolean, persistOpen?: boolean }): AppThunk {
    return (async (dispatch, getState) => {

        const projectId = getState().PROJECT_META.project;

        if (projectId !== undefined) {
            const isAddedNode = getState().OPEN_FILES.entities[node.id];//.open.some(o => o.id === node.id)

            if (!isAddedNode) {
                throw new ErrorHelper("State not found", "tried to access a file instance before it was added");

            }

            // const foundNode = getState().OPEN_FILES.open.find(n => n.id === node.id);
            const foundNode = getState().FILE_TREE.entities[node.id];

            if (!foundNode) {
                dispatch(OpenTabsAction.closeAndChangeWindow(node.id.toString()));
                throw new ErrorHelper("???", `Removing file <${node.id}> from state due to not existing in file tree`);

            }

            if (foundNode.data.extension === FileType.FOLDER) {
                throw new ErrorHelper("???", "Can't open a folder in the code editor!");

            } else {

                // if(node.edited !== undefined && foundNode.data.edited !== node.edited) {
                //     dispatch()
                // }

                dispatch(ProjectMetaActions.select(node.id.toString()));

                const repository = new OpenTabsRepository();
                console.log(node);

                const dbMapper: DbFileTabType = {
                    id: foundNode.id.toString(),
                    project_id: projectId,
                    line: foundNode.data.line || 1,
                    edited: node.edited || foundNode.data.edited,
                    saved: node.saved || foundNode.data.saved
                };
                // const dbMapper = getState().OPEN_FILES.open.map<DbFileTabType>(o => {
                //     const state = getState();
                //     const index = state.FILE_TREE.tree.findIndex(f => f.id === o.id);

                //     return {
                //         ...state.FILE_TREE.tree[index].data,
                //         project_id: projectId,
                //         id: o.id.toString(),
                //         line: state.FILE_TREE.tree[index].data.line || 1,
                //         // column: 1,
                //     }
                // });
                if (node.persistOpen === undefined || node.persistOpen === true) {
                    await repository.saveOpen(dbMapper, projectId);
                }

                // const saveDBMapper = dbMapper.find(f => f.id === node.id) as DbFileTabType;
                repository.saveSelected({ ...dbMapper, name: dbMapper.id, id: projectId });
            }

        } else {
            throw new ErrorHelper(ApiStatusEnum.STATE_NOT_FOUND, "Project id cant be found, must be set before trying to access the storage");

        }

    });
}

export const OpenTabsAction = { open, closeAndChangeWindow };