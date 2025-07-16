import { NodeModel } from "@minoru/react-dnd-treeview";
import OpenTabsSlice from "../open-files/OpenTabsSlice";
import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData, OpenFileMetaData, OpenFilesType, TreeType } from "@/types/state-types";
import { AppThunk } from "@/redux/store";
import { ApiType } from "@/types/ApiResponse.type";
import FileTreeSlice from "./FileTreeSlice";
import { zodValidate } from "@/helpers/zod/ZodValidate";
import { IFileCreation } from "@/types/zTypes";
import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiFile } from "@/services/api/File";
import { FileCreation } from "@/types/FileCreation.type";
import { OpenTabsAction as OpenTabsAction } from "../open-files/OpenFilesActions";
import { OpenTabsRepository } from "@/services/database/OpenTabsRepository";
import { FileTab } from "@/types/Database.type";

function createAndOpenNode(node: DeclaredNodeModel<FileMetaData>, projectId: string): AppThunk {
    return (async (dispatch, getState) => {
        const { pathNames, fullPath } = findParent(node, getState);
        const created = await pushNode({ ...node, data: { ...node.data, pathNames, fullPath } }, projectId);
        //await new Repository().save(created);

        dispatch(FileTreeSlice.actions.createNode({
            id: created.id,
            text: created.name,
            parent: created.parent === null ? "0" : created.parent,
            data: {
                extension: created.extension,
                fullPath: created.path,
                pathNames: created.path === null ? undefined : created.path.map((p) => getState().FILE_TREE.tree.find((s) => s.id === p)?.text) as string[],
                content: created.content,
                line: 1,
                isDropped: false,
                author: created.author
            }
        }));

        const createdNode = getState().FILE_TREE.tree.find((n) => n.id === created.id);

        if (createdNode && createdNode.data?.extension.toLowerCase() !== FileType.FOLDER) {
            dispatch(OpenTabsSlice.actions.add({
                ...createdNode,
                data: {
                    ...createdNode.data as FileMetaData,
                    edited: true,
                    saved: true,
                }
            }));

            dispatch(OpenTabsAction.open({
                ...createdNode,
                data: {
                    ...createdNode.data as FileMetaData,
                    edited: true,
                    saved: true,
                }
            }));
        }
    })
}


function createStore(files: ApiType.File[]): AppThunk {
    return (async (dispatch, getState) => {
        try {

            const formatedFiles = files.map<DeclaredNodeModel<FileMetaData>>((file) => {
                return {
                    id: file.id,
                    parent: file.parent || "0",
                    text: file.name,
                    droppable: file.extension.toUpperCase() === "FOLDER",
                    data: {
                        extension: file.extension,
                        author: file.author,
                        fullPath: file.path,
                        pathNames: file.path === null ? undefined : file.path.map((p) => files.find((s) => s.id === p)?.name) as string[],
                        content: file.content,
                        line: undefined,
                        isDropped: file.id === "0"
                    }
                }
            })

            dispatch(FileTreeSlice.actions.createStore(formatedFiles));

            const projectId = getState().FILE_TREE.project;

            if (projectId !== undefined) {
                const openTabsState = await new OpenTabsRepository().get(projectId);

                if (openTabsState !== undefined) {

                    const openTabsFiles: DeclaredNodeModel<OpenFileMetaData>[] = openTabsState.files.map<DeclaredNodeModel<OpenFileMetaData>>((f) => {
                        const fileRef = formatedFiles.find((i) => i.id === f.id) as DeclaredNodeModel<FileMetaData>;

                        return {
                            ...fileRef,
                            id: f.id,
                            data: {
                                ...fileRef.data,
                                pathNames: fileRef.data.pathNames,
                                saved: f.isSaved,
                                edited: true //Todo guardar este estado en el indexedDB
                            }
                        };
                    });

                    dispatch(OpenTabsSlice.actions.createStore({
                        open: openTabsFiles,
                        selected: openTabsFiles.find((f) => f.id === openTabsState.selected)
                    }));

                }

            } else {
                throw new ErrorHelper("aaa", "test");
            }

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    });
}


function findParent(node: NodeModel<FileMetaData>, getState: () => { OPEN_FILES: OpenFilesType, FILE_TREE: TreeType }) {

    const pathNames: string[] = [];
    const fullPath: string[] = [];

    pathNames.push(node.text);

    const find = (id: string) => {
        const found: NodeModel<FileMetaData> | undefined = getState().FILE_TREE.tree.find((parentNode) => {
            return parentNode.id === id && id !== "0";
        });

        if (found !== undefined) {
            fullPath.unshift(found.id.toString());
            pathNames.unshift(found.text);

            if (found.parent !== "0") {
                find(found.parent as string);
            }
        }
    };

    find(node.parent as string);

    return { pathNames, fullPath };
}


async function pushNode(node: DeclaredNodeModel<FileMetaData>, projectId: string) {
    const [success, data] = zodValidate<IFileCreation>({
        projectId,
        name: node.text,
        author: node.data.author,
        extension: node.data.extension,
        isFolder: node.droppable as boolean,
        path: node.data.fullPath?.filter((p) => p !== node.id.toString()) || []
    }, FileCreation);

    if (!success) {
        Object.entries(data.errors).forEach((e) => console.error(e));
        throw new ErrorHelper("aaaa nose");
    }

    const response = await ApiFile.create(data.data);

    if (response instanceof ErrorHelper) {
        throw new ErrorHelper(response.message, response.exception);

    }

    return await response.json() as ApiType.File;

}


function deleteAndChilds(node: DeclaredNodeModel<FileMetaData>): AppThunk {
    return (async (dispatch, getState) => {

        const response = await ApiFile.remove(node.id.toString());

        if (response instanceof ErrorHelper) {
            throw new ErrorHelper(response.message, response.exception);

        }

        const find = (id: string) => {
            const children = getState().FILE_TREE.tree.filter((child) => child.parent === id);

            //TODO esto puede causar problemas de rendimiento, se puede refactorizar 
            //TODO recibiendo un array completo en closeAndChangeWindow() o incluso en delete()

            children.forEach((file) => {
                dispatch(FileTreeSlice.actions.delete(file.id.toString()));
                dispatch(OpenTabsAction.closeAndChangeWindow(file.id));
                file.droppable && find(file.id.toString());

            });
        };

        find(node.id.toString());
        dispatch(FileTreeSlice.actions.delete(node.id.toString()));
        dispatch(OpenTabsAction.closeAndChangeWindow(node.id));

    });
}

export const FileTreeActions = { createAndOpenNode, createStore, deleteAndChilds };