import { NodeModel } from "@minoru/react-dnd-treeview";
import { AppThunk } from "../store";
import treeSlice from "./treeSlice";
import openFilesSlice from "../open-files/openFilesSlice";
import FileType from "@/types/enum/FileType";
import { FileMetaData } from "@/types/state-types";
import { openFilesAction } from "../open-files/openFilesActions";

const createAndOpenNode = (node: NodeModel<FileMetaData>): AppThunk => (dispatch, getState) => {
    let pathNames: string[] = [node.text];
    const fullPath: number[] = [Number(node.id)];

    const findParent = (id: number) => {

        const found: NodeModel<FileMetaData> | undefined = getState().FILE_TREE.tree.find((parentNode) => {
            return parentNode.id === id;
        });

        if (found !== undefined) {
            fullPath.unshift(found.id as number);
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
                fileType: node.data?.fileType as string
            }
        }
    ));

    const createdNode = getState().FILE_TREE.tree.find((n) => n.id === node.id);

    if (createdNode && createdNode.data?.fileType !== FileType.FOLDER) {
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