import { RootState } from "@/redux/store";
import FileType from "@/types/enum/FileType";
import { DeclaredNodeModel, FileMetaData, FileTreeType } from "@/types/ReduxState.type";
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

const filesAdapter = createEntityAdapter<FileTreeType, string>({
    selectId: (file: FileTreeType) => file.id,
});

const initialState = filesAdapter.getInitialState();

const FileTreeSlice = createSlice({
    name: "TREE",
    initialState,
    reducers: {

        createStore: filesAdapter.addMany,

        delete: filesAdapter.removeOne,

        createNode(state, action: PayloadAction<DeclaredNodeModel<FileMetaData>>) {

            if (action.payload.parent !== 0) {
                filesAdapter.addOne(state, {
                    ...action.payload,
                    droppable: action.payload.data.extension === FileType.FOLDER ? true : undefined,
                    data: {
                        ...action.payload.data,
                        extension: action.payload.data.extension || FileType.PLAIN_TEXT
                    }
                });
                //     const newNode: DeclaredNodeModel<FileMetaData> = {
                //         ...action.payload,
                //         droppable: action.payload.data?.extension === FileType.FOLDER ? true : undefined,
                //         data: {
                //             ...action.payload.data,
                //             extension: action.payload.data?.extension || FileType.PLAIN_TEXT
                //         }
                //     };

                //     state.tree.push(newNode);

            } else {
                // state.tree.push(action.payload);
                filesAdapter.addOne(state, action.payload);
            }
        },

        edit(state, action: PayloadAction<{ id: string, content: string | undefined }>) {
            // const index = state.tree.findIndex(f => f.id === action.payload.id);
            // if(index === -1) {
            // throw new ErrorHelper("???", "File can't be found in the tree state")
            // }
            const { id, content } = action.payload;
            const prev = state.entities[id];

            filesAdapter.updateOne(state, {
                id,
                changes: {
                    data: {
                        ...prev.data,
                        content,
                        saved: false,
                        edited: content !== prev.data.last_content,
                    }
                }
            });

            // state.tree[index] = {
            //     ...state.tree[index],
            //     data: {
            //         ...state.tree[index].data,
            //         content: action.payload.content,
            //         saved: false,
            //         edited: true
            //     }
            // }
        },

        save(state, action: PayloadAction<{ id: string }[]>) {
            filesAdapter.updateMany(state, action.payload.map(f => {
                const ref = state.entities[f.id];
                return {
                    id: f.id,
                    changes: {
                        data: {
                            ...ref.data,
                            last_content: ref.data.content,
                            saved: true,
                            edited: true,
                        }
                    }
                }
            }));
            // action.payload.forEach(f => {
            //     const index = state.tree.findIndex((n) => n.id === f.id);

            //     state.tree[index] = {
            //         ...state.tree[index],
            //         data: {
            //             ...state.tree[index].data,
            //             last_content: state.tree[index].data.content,
            //             saved: true,
            //             edited: true
            //         }
            //     }
            // });
        },

        unedit(state, action: PayloadAction<string>) {
            const id = action.payload;
            const prev = state.entities[id];

            filesAdapter.updateOne(state, {
                id,
                changes: {
                    data: {
                        ...prev.data,
                        edited: false,
                    }
                }
            });
        },

        dropFrom(state, action: PayloadAction<{ id: string, isDropped?: boolean }>) {

            // const foundNode = state.tree.find((n) => n.id === action.payload?.id);

            // if (action.payload === undefined) {
            //     state.selected = undefined;

            // } else {

            // const i = state.tree.findIndex((node) => node.id === action.payload?.id);
            // state.tree[i].data.isDropped = action.payload.isDropped;

            // state.selected = action.payload.id.toString();

            // if (foundNode.data.fullPath.length > 0) {
            //     let builtPath = "";

            //     foundNode.data.fullPath.forEach((x, i) => {
            //         if (i + 1 !== foundNode.data.fullPath?.length) {
            //             builtPath = builtPath + (i > 0 ? "/" : "") + x;
            //             const parentIndex = state.tree.findIndex((node) => node.id === builtPath);

            //             if (parentIndex >= 0 && state.tree.at(parentIndex)?.droppable) {
            //                 state.tree[parentIndex].data.isDropped = true;
            //             }
            //         }
            //     });
            // }
            const { id, isDropped } = action.payload;
            const ref = state.entities[id].data;
            // filesAdapter.updateOne(state, {
            //     id: action.payload?.id,
            //     changes: {
            //         data: {
            //             ...ref,
            //             isDropped
            //         }
            //     }
            // });
            const path: string[] = [id];
            if (ref.fullPath.length > 0) {
                let builtPath = "";

                path.push(
                    ...ref.fullPath.map((x, i) => {
                        if (i + 1 !== ref.fullPath?.length) {
                            builtPath = builtPath + (i > 0 ? "/" : "") + x;
                            return builtPath;
                        }
                    }).filter(f => f !== undefined).toReversed() as string[]
                )
            }

            console.log(path)
            filesAdapter.updateMany(state, path.map((id_, i) => {
                return {
                    id: id_,
                    changes: {
                        data: {
                            ...state.entities[id_].data,
                            isDropped: //i === 0 ? isDropped :
                                true,
                        }
                    }
                }
            }));
        }

    },
});

export const selectOpenFiles = createSelector([(state: RootState) => state.OPEN_FILES, (state: RootState) => state.FILE_TREE],
    (openTabs, files) => openTabs.ids.map((id) => files.entities[id])
        .filter((f): f is FileTreeType => f !== undefined)
);

export const FileTreeSelectors = filesAdapter.getSelectors((state: RootState) => state.FILE_TREE);

export default FileTreeSlice;