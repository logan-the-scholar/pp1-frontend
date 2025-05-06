import { NodeModel } from "@minoru/react-dnd-treeview";
import { AppThunk } from "./store";
import treeSlice from "./treeSlice";
import openFilesSlice from "./openFilesSlice";
import FileType from "@/types/enum/FileType";
import { FileMetaData } from "@/types/state-types";

export const createAndOpenNode = (node: NodeModel<FileMetaData>): AppThunk => (dispatch, getState) => {
    let pathNames: string[] = [node.text];
    const fullPath: number[] = [Number(node.id)];

    const findParent = (id: number) => {

        const found: NodeModel<FileMetaData> | undefined = getState().TREE.find((parentNode) => {
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

    const createdNode = getState().TREE.find((n) => n.id === node.id);

    if (createdNode && createdNode.data?.fileType !== FileType.FOLDER) {
        dispatch(openFilesSlice.actions.select(createdNode));
    }
};

// export const createNodeAndOpen = createAsyncThunk("three/createAndOpenNode",
//     async (payload: NodeModel<FileMetaData>, { dispatch, getState }) => {
//         dispatch(treeSlice.actions.createNode(payload));

//         const state = getState() as RootState;

//         const createdNode = state.tree.find((node) => node.id === payload.id);

//         if (createdNode && payload.data?.fileType !== FileType.FOLDER) {
//             dispatch(openFilesSlice.actions.set(createdNode));
//         }
//     }
// );