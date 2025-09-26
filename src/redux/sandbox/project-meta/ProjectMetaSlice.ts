import { ProjectMetaType } from "@/types/ReduxState.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

const initialState: ProjectMetaType = {
    selected: undefined,
    open: undefined,
    project: undefined,
    branch: undefined
};

const ProjectMetaSlice = createSlice({
    name: "META",
    initialState,
    reducers: {
        open(state, action: PayloadAction<{ id: string } | undefined>) {
            state.open = action.payload?.id || undefined;
        },

        select(state, action: PayloadAction<{ id: string } | undefined>) {
            state.selected = action.payload?.id || undefined;
        },

        setProject(state, action: PayloadAction<string>) {
            state.project = action.payload;
        },

        setBranch(state, action: PayloadAction<string>) {
            state.branch = action.payload;
        }
    },

});

export default ProjectMetaSlice;