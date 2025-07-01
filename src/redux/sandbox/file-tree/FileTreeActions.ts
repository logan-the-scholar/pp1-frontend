import { NodeModel } from "@minoru/react-dnd-treeview";
import openFilesSlice from "../open-files/openFilesSlice";
import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData } from "@/types/state-types";
import { openFilesAction } from "../open-files/openFilesActions";
import { AppThunk } from "@/redux/store";
import { FileRepository } from "@/services/database/FileRepository";
import { ApiType } from "@/types/ApiResponse.type";
import FileTreeSlice from "./FiletreeSlice";

const createAndOpenNode = (node: NodeModel<FileMetaData>): AppThunk => (dispatch, getState) => {
    let pathNames: string[] = [node.text];
    const fullPath: string[] = [node.id.toString()];

    const findParent = (id: number) => {

        const found: NodeModel<FileMetaData> | undefined = getState().FILE_TREE.tree.find((parentNode) => {
            return parentNode.id === id;
        });

        if (found !== undefined) {
            fullPath.unshift(found.id.toString());
            pathNames.unshift(found.text);

            if (found.parent !== 0) {
                findParent(found.parent as number);
            }
        }
    };

    findParent(node.parent as number);

    dispatch(FileTreeSlice.actions.createNode(
        {
            ...node,
            data: {
                pathNames,
                fullPath,
                extension: node.data?.extension as string
            }
        }
    ));

    const createdNode = getState().FILE_TREE.tree.find((n) => n.id === node.id);

    if (createdNode && createdNode.data?.extension !== FileType.FOLDER) {
        dispatch(openFilesSlice.actions.add({
            ...createdNode,
            data: {
                ...createdNode.data as FileMetaData,
                edited: true,
                saved: true,
            }
        }));

        dispatch(FileTreeSlice.actions.select(createdNode.id));

        dispatch(openFilesAction.open(
            {
                ...createdNode,
                data: {
                    ...createdNode.data as FileMetaData,
                    edited: true,
                    saved: true,
                }
            }));
    }
};

function createStore(files: ApiType.File[]): AppThunk {
    return (async (dispatch, getState) => {
        try {

            await new FileRepository().createStore(files);

            dispatch(FileTreeSlice.actions.createStore(
                files.map<DeclaredNodeModel<FileMetaData>>((file) => {
                    return {
                        id: file.id,
                        parent: file.parent,
                        text: file.name,
                        droppable: file.extension.toUpperCase() === "FOLDER",
                        data: {
                            extension: file.extension,
                            fullPath: file.path,
                            pathNames: file.pathNames,
                            content: file.content,
                            line: undefined,
                            isDropped: undefined
                        }
                    }
                })
            ));

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    });
}

export const FileTreeActions = { createAndOpenNode, createStore };