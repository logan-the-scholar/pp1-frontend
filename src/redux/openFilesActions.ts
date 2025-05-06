import { NodeModel } from "@minoru/react-dnd-treeview";
import { AppThunk } from "./store";
import openFilesSlice from "./openFilesSlice";
import { FileMetaData, OpenFileMetaData } from "@/types/state-types";

const open = (node: NodeModel<FileMetaData> | NodeModel<OpenFileMetaData>): AppThunk => (dispatch, getState) => {
    const state = getState();

    if (state.OPEN_FILES.open.find((n) => n.id === node.id) === undefined) {
        const previousEditedFile = state.OPEN_FILES.open.find((n) => n.data?.edited === false);

        if (previousEditedFile !== undefined) {

        }

        // const freshState = getState();

        // freshState.OPEN_FILES.open.splice(freshState.OPEN_FILES.open.findIndex((n) => n.id === freshState.OPEN_FILES.selected?.id) || 0, 0, {
        //     ...node, data: {
        //         edited: false,
        //         saved: true,
        //         ...node.data as FileMetaData
        //     }
        // });

        dispatch(openFilesSlice.actions.addOrReplaceFile(node));

    } else {
        dispatch(openFilesSlice.actions.select({
            ...node,
            data: {
                saved: true,
                edited: false,
                ...node.data as FileMetaData | OpenFileMetaData
            }
        }));

    }
}

export const openFilesAction = { open };