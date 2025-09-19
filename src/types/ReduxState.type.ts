import { NodeModel } from "@minoru/react-dnd-treeview"

export type FileMetaData = {
    extension: string,
    fullPath: string[],
    versionId: string;
    content?: string,
    last_content?: string;
    line?: number,
    isDropped?: boolean,
    author: string,
    commit: string,
    movedFrom?: string,
    isDrafted: boolean,
    edited: boolean,
    saved: boolean,
}

export type DeclaredNodeModel<T> = NodeModel & {
    data: T
}

export type TreeType = {
    tree: DeclaredNodeModel<FileMetaData>[],
    selected: DeclaredNodeModel<FileMetaData> | undefined,
    project: string | undefined,
    branch: string | undefined
}

export type OpenFile = {
    id: string;
}

export type OpenFilesType = {
    selected: OpenFile | undefined,
    open: OpenFile[]
}