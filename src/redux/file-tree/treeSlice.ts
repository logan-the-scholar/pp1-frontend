import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData } from "@/types/state-types";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Satellite } from "lucide-react";

type treeType = {
    tree: DeclaredNodeModel<FileMetaData>[],
    selected: DeclaredNodeModel<FileMetaData> | undefined
}

const treeState: treeType = {
    tree: [
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
    ],

    selected: undefined
};

const treeSlice = createSlice({
    name: "TREE",
    initialState: treeState,
    reducers: {

        createNode(state, action: PayloadAction<DeclaredNodeModel<FileMetaData>>) {
            if (action.payload.parent !== 0) {

                const newNode: DeclaredNodeModel<FileMetaData> = {
                    ...action.payload,
                    droppable: action.payload.data?.fileType === FileType.FOLDER ? true : undefined,
                    data: {
                        ...action.payload.data,
                        fileType: action.payload.data?.fileType || FileType.PLAIN_TEXT
                    }
                };

                state.tree.push(newNode);

            } else {
                state.tree.push(action.payload);

            }
        },

        select(state, action: PayloadAction<DeclaredNodeModel<FileMetaData> | undefined>) {

            if (action.payload !== undefined && action.payload.data?.fileType !== FileType.FOLDER) {
                state.selected = {
                    id: action.payload.id,
                    parent: action.payload.parent,
                    text: action.payload.text,
                    data: {
                        ...action.payload.data
                    }
                }

            } else if (action.payload === undefined) {
                state.selected = undefined;
            }

            action.payload?.data?.fullPath?.forEach((x) => {
                const parentIndex = state.tree.findIndex((node) => node.id === x);

                if (parentIndex >= 0 && state.tree.at(parentIndex)?.droppable) {
                    state.tree[parentIndex].data.isDropped = true;
                }
            });

            // if (nodeParents) {
            //     nodeParents.forEach((node) => state.tree)
            // }
            // state.tree.filter((node) => action.payload?.data?.fullPath?.includes((state.tree.find((n) => n.id === node.id) as NodeModel<FileMetaData>)));
        },

    },

});

export default treeSlice;