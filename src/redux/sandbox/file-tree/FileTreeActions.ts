import { NodeModel } from "@minoru/react-dnd-treeview";
import OpenTabsSlice from "../open-files/OpenTabsSlice";
import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData, FileTreeType } from "@/types/ReduxState.type";
import { AppDispatch, AppThunk, RootState } from "@/redux/store";
import FileTreeSlice, { FileTreeSelectors } from "./FileTreeSlice";
import { zodValidate } from "@/helpers/zod/ZodValidate";
import { IFileCreation } from "@/types/zTypes/zTypes";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiFile } from "@/services/api/File";
import { FileCreation } from "@/types/zTypes/FileCreation.type";
import { OpenTabsAction as OpenTabsAction } from "../open-files/OpenFilesActions";
import { OpenTabsRepository } from "@/services/database/OpenTabsRepository";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";
import { createAsyncThunk } from "@reduxjs/toolkit/react";
import FileMapper from "@/helpers/FileMapper";
import { ProjectMetaActions } from "../project-meta/ProjectMetaActions";
import { DbFileTabType } from "@/types/Database.type";
import { ApiType } from "@/types/Api.type";

type CreateNodeType = { node: DeclaredNodeModel<FileMetaData>, repoId: string, branch: string };
type DeleteNodeType = { id: string, commit: string };
type ThunkOptions = { state: RootState; dispatch: AppDispatch; rejectValue: { message: string }; };

const createAndOpenNode = createAsyncThunk<void, CreateNodeType, ThunkOptions>(
    "TREE/create",
    async ({ node, repoId, branch }, { getState, dispatch, rejectWithValue }) => {

        const pathNames = findParent(node, getState);
        const created = await pushNode({ node: { ...node, data: { ...node.data, fullPath: pathNames } }, repoId, branch });

        dispatch(FileTreeSlice.actions.createNode(FileMapper(created)));

        const createdNode = getState().FILE_TREE.entities[created.id];

        if (createdNode && createdNode.data?.extension.toLowerCase() !== FileType.FOLDER) {

            dispatch(OpenTabsAction.open({
                ...createdNode,
                data: {
                    ...createdNode.data as FileMetaData,
                    edited: true,
                    saved: true,
                }
            }));
        }
    }
);

function createStore(files: ApiType.File[]): AppThunk {
    return (async (dispatch, getState) => {
        try {

            const projectId = getState().PROJECT_META.project;

            if (projectId !== undefined) {

                const repository = new OpenTabsRepository();
                const openTabsMeta = await repository.get(projectId);

                const formatedFiles = files.map<FileTreeType>(file => FileMapper(file, openTabsMeta?.find(m => m.id === file.path.toSpliced(0, 1, "0").join("/"))));
                dispatch(FileTreeSlice.actions.createStore(formatedFiles));

                if (openTabsMeta !== undefined) {

                    // NO ABRE archivos que se eliminaron desde el backend, 
                    // se puede cambiar a "razon de eliminacion" tomando el ultimo commit

                    const openTabsFiles = openTabsMeta.map((f) => {
                        const fileRef = formatedFiles.find((i) => i.id === f.id)?.id;
                        return fileRef !== undefined ? fileRef : undefined
                    }).filter((f) => f !== undefined);

                    let current = await repository.getSelected(projectId);

                    if (current === undefined) {
                        current = { id: projectId, name: openTabsFiles[0] };
                    }

                    console.log(current)
                    dispatch(ProjectMetaActions.select(current.name));

                    dispatch(OpenTabsSlice.actions.createStore(openTabsFiles));

                } else {
                    await repository.clear(projectId);

                    //TODO aqui o antes de llegar aqui se puede hacer fetch al estado de sesion. en caso de no haber una en local
                }

            } else {
                throw new ErrorHelper(ApiStatusEnum.STATE_NOT_FOUND, "Project id cant be found, must be set before trying to access the storage");

            }

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    });
}


function findParent(node: NodeModel<FileMetaData>, getState: () => RootState) {

    const pathNames: string[] = [];

    pathNames.push(node.text);

    const find = (id: string) => {
        const found = id !== "0" ? getState().FILE_TREE.entities[id] : undefined;

        if (found !== undefined) {
            pathNames.unshift(found.text);

            if (found.parent !== "0") {
                find(found.parent as string);
            }
        }
    };

    find(node.parent.toString());

    return pathNames;
}


async function pushNode({ node, repoId, branch }: CreateNodeType) {

    const formatedPath = node.data.fullPath?.map((p) => "/" + p) || [];
    formatedPath.unshift(":");

    const [success, data] = zodValidate<IFileCreation>({
        repoId,
        name: node.text,
        author: node.data.author,
        extension: node.data.extension,
        path: formatedPath,
        content: node.data.content || null,
        branch: branch,
        createdAt: Number(node.id) || Date.now()
    }, FileCreation);

    if (!success) {
        Object.entries(data.errors).forEach((e) => console.error(e));
        throw new ErrorHelper("nose");
    }

    const response = await ApiFile.create(data.data);

    if (response instanceof ErrorHelper) {
        throw new ErrorHelper(response.message, response.exception);

    }

    return await response.json() as ApiType.File;
}

const deleteAndChilds = createAsyncThunk<void, DeleteNodeType, ThunkOptions>(
    "TREE/deleteAndChilds",
    async ({ id, commit }, { getState, dispatch, rejectWithValue }) => {

        const response = await ApiFile.remove(id, commit);

        if (response instanceof ErrorHelper) {
            throw new ErrorHelper(response.message, response.exception);

        }

        //TODO ESPERAR LA RESPUESTA DEL BACK Y CONFIRMAR/COMPARAR LOS ELEMENTOS HIJOS ELIMINADOS

        const find = (id: string) => {
            // const children = getState().FILE_TREE.tree.filter((child) => child.parent === id);
            const children = FileTreeSelectors.selectAll(getState()).filter(c => c.parent === id);

            //TODO esto puede causar problemas de rendimiento, se puede refactorizar 
            //TODO recibiendo un array completo en closeAndChangeWindow() o incluso en delete()

            children.forEach((file) => {
                dispatch(FileTreeSlice.actions.delete(file.id.toString()));
                dispatch(OpenTabsAction.closeAndChangeWindow(file.id.toString()));
                file.droppable && find(file.id.toString());

            });
        };

        find(id);
        dispatch(FileTreeSlice.actions.delete(id));
        dispatch(OpenTabsAction.closeAndChangeWindow(id));

    }
);

function save(data: { id: string, line?: number }[], project: string): AppThunk {
    return (async (dispatch, getState) => {
        dispatch(FileTreeSlice.actions.save(data));
        new OpenTabsRepository().saveOpen(data.map<DbFileTabType>(f => Object({
            project_id: project,
            id: f.id,
            line: f.line || 1,
            edited: true,
            saved: true,
        })));
    });
}

export const FileTreeActions = { createAndOpenNode, createStore, deleteAndChilds, save };