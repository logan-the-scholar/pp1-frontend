import { FileMetaData } from "@/features/sandbox/FileViewer";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: NodeModel<FileMetaData>[] = [
    {
        "id": 1,
        "parent": 0,
        "droppable": true,
        "text": "common",
        "data": {
            "fileType": "folder"
        }
    },
    {
        "id": 2,
        "parent": 1,
        "text": "seed-data.json",
        "data": {
            "fullPath": [1],
            "content": "none",
            "fileType": "json"
        }
    },
    {
        "id": 3,
        "parent": 1,
        "text": "config.ts",
        "data": {
            "fullPath": [1],
            "fileType": "ts"
        }

    },
    {
        "id": 4,
        "parent": 0,
        "droppable": true,
        "text": "root",
        "data": {
            "fileType": "folder"
        }
    },
    {
        "id": 5,
        "parent": 4,
        "droppable": true,
        "text": "app",
        "data": {
            "fullPath": [4],
            "fileType": "folder"
        }
    },
    {
        "id": 6,
        "parent": 5,
        "text": "index.ts",
        "data": {
            "fullPath": [4, 5],
            "fileType": "ts"
        }
    }
];

const threeSlice = createSlice({
    name: "three",
    initialState,
    reducers: {
        getById(state, action: PayloadAction<string | number>) {

        },

        createNode(state, action: PayloadAction<NodeModel<FileMetaData>>) {
            if (action.payload.parent !== 0) {
                const newNode: NodeModel<FileMetaData> = action.payload;
                const fullPath: number[] = [];

                const findParent = (id: number) => {

                    const found: NodeModel<FileMetaData> | undefined = state.find((parentNode) => parentNode.id === id);

                    if (found !== undefined) {
                        fullPath.unshift(found.id as number);

                        if (found.parent !== 0) {
                            findParent(found.parent as number);
                        }
                    }
                };

                findParent(action.payload.parent as number);

                newNode.data = { fullPath, fileType: action.payload.data?.fileType || "plain-text" };
                state.push(newNode);
            } else {
                state.push(action.payload);

            }
        }
    },
});

export const { getById } = threeSlice.actions;
export default threeSlice.reducer;