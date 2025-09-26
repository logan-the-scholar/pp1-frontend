import { AppThunk } from "@/redux/store";
import FileTreeSlice from "../file-tree/FileTreeSlice";
import ProjectMetaSlice from "./ProjectMetaSlice";

function select(id: string): AppThunk {
    return (async (dispatch, getState) => {
        dispatch(FileTreeSlice.actions.dropFrom({ id }));
        const foundNode = getState().FILE_TREE.entities[id];

        if (foundNode.droppable !== true) {
            dispatch(ProjectMetaSlice.actions.select({id}));
            dispatch(ProjectMetaSlice.actions.open({id}));
        }
    });
}

function open(id: string): AppThunk {
    return (async (dispatch, getState) => {
        dispatch(FileTreeSlice.actions.dropFrom({ id, }));
        dispatch(ProjectMetaSlice.actions.open());
        dispatch(ProjectMetaSlice.actions.select());

    });
}

export const ProjectMetaActions = { select, open };