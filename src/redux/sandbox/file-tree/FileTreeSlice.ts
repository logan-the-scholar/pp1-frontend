import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData, TreeType } from "@/types/state-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const treeState: TreeType = {
    tree: [],
    selected: undefined,
    project: undefined
};

const FileTreeSlice = createSlice({
    name: "TREE",
    initialState: treeState,
    reducers: {

        createStore(state, action: PayloadAction<DeclaredNodeModel<FileMetaData>[]>) {
            console.log(action.payload);
            state.tree = [...action.payload];
        },

        createNode(state, action: PayloadAction<DeclaredNodeModel<FileMetaData>>) {
            if (action.payload.parent !== 0) {

                const newNode: DeclaredNodeModel<FileMetaData> = {
                    ...action.payload,
                    droppable: action.payload.data?.extension === FileType.FOLDER ? true : undefined,
                    data: {
                        ...action.payload.data,
                        extension: action.payload.data?.extension || FileType.PLAIN_TEXT
                    }
                };

                state.tree.push(newNode);

            } else {
                state.tree.push(action.payload);

            }
        },

        /**Highlights visually the provided node and saves it as a state*/
        select(state, action: PayloadAction<{ id: string | number, isDropped?: boolean } | undefined>) {
            const foundNode = state.tree.find((n) => n.id === action.payload?.id);

            if (action.payload === undefined || foundNode === undefined) {
                state.selected = undefined;

            } else {

                const i = state.tree.findIndex((node) => node.id === action.payload?.id);
                state.tree[i].data.isDropped = action.payload.isDropped;

                state.selected = {
                    id: foundNode.id,
                    parent: foundNode.parent,
                    text: foundNode.text,
                    data: {
                        ...foundNode.data,
                        isDropped: action.payload.isDropped
                    }
                }

                if (foundNode.data?.fullPath !== null) {
                    foundNode.data.fullPath.forEach((x) => {
                        const parentIndex = state.tree.findIndex((node) => node.id === x);

                        if (parentIndex >= 0 && state.tree.at(parentIndex)?.droppable) {
                            state.tree[parentIndex].data.isDropped = true;
                        }
                    });
                }

            }

        },

        delete(state, action: PayloadAction<string>) {
            return { ...state, tree: state.tree.filter((node) => node.id !== action.payload) };
        },

        setProject(state, action: PayloadAction<string>) {
            return { ...state, project: action.payload };
        }

    },

});

export default FileTreeSlice;