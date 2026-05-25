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
            } else {
                filesAdapter.addOne(state, action.payload);

            }
        },

        edit(state, action: PayloadAction<{ id: string, content: string | undefined }>) {
            const { id, content } = action.payload;
            const prev = state.entities[id];

            filesAdapter.updateOne(state, {
                id,
                changes: {
                    data: {
                        ...prev.data,
                        content,
                        saved: content === prev.data.last_content,//false,
                        edited: true//content !== prev.data.last_content,
                    }
                }
            });
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
            const { id, isDropped } = action.payload;
            const ref = state.entities[id];
            const path: string[] = [id];
            if (ref.data.fullPath.length > 0) {
                let builtPath = "";

                path.push(
                    ...ref.data.fullPath.map((x, i) => {
                        if (i + 1 !== ref.data.fullPath?.length) {
                            builtPath = builtPath + (i > 0 ? "/" : "") + x;
                            return builtPath;
                        }
                    }).filter(f => f !== undefined).toReversed() as string[]
                );
            }

            console.log(path)
            filesAdapter.updateMany(state, path.map((id_, i) => {
                return {
                    id: id_,
                    changes: {
                        data: {
                            ...state.entities[id_].data,
                            isDropped: id_ === id ? ref.droppable && !ref.data.isDropped : true//i === 0 ? isDropped :
                                // true,
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