import { ProjecLoadStatusEnum } from "@/types/state-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const projectLoadStatusSlice = createSlice({
    name: "PROJECT_LOAD_STATUS",
    initialState: { status: "nothing" },
    reducers: {
        updated(state, action: PayloadAction<ProjecLoadStatusEnum>) {
            state.status = action.payload;
        }
    }
});

export default projectLoadStatusSlice;