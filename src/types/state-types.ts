import { NodeModel } from "@minoru/react-dnd-treeview"

export type FileMetaData = {
    extension: string,
    fullPath: string[],
    // pathNames?: string[],
    versionId: string;
    content?: string,
    line?: number,
    isDropped?: boolean,
    author: string,
    commit: string,
    movedFrom?: string,
    isDrafted: boolean,
}

export type TreeType = {
    tree: DeclaredNodeModel<FileMetaData>[],
    selected: DeclaredNodeModel<FileMetaData> | undefined,
    project: string | undefined,
    branch: string | undefined
}

export type OpenFileMetaData = FileMetaData & {
    edited: boolean,
    saved: boolean,
}

export type DeclaredNodeModel<T> = NodeModel & {
    data: T
}

export type OpenFilesType = {
    selected: DeclaredNodeModel<OpenFileMetaData> | undefined,
    open: DeclaredNodeModel<OpenFileMetaData>[]
}