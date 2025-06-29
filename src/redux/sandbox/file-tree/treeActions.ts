import { NodeModel } from "@minoru/react-dnd-treeview";
import treeSlice from "./treeSlice";
import openFilesSlice from "../open-files/openFilesSlice";
import FileType from "@/types/enum/FileType";
import { FileMetaData } from "@/types/state-types";
import { openFilesAction } from "../open-files/openFilesActions";
import { AppThunk } from "@/redux/store";

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

    dispatch(treeSlice.actions.createNode(
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

        dispatch(treeSlice.actions.select(createdNode.id));

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

export const treeActions = { createAndOpenNode };