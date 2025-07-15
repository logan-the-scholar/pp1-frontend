import { NodeModel } from "@minoru/react-dnd-treeview"

export type FileMetaData = {
    extension: string,
    fullPath: string[] | null,
    pathNames?: string[],
    content?: string,
    line?: number,
    isDropped?: boolean,
    author: string,
}

export type TreeType = {
    tree: DeclaredNodeModel<FileMetaData>[],
    selected: DeclaredNodeModel<FileMetaData> | undefined,
    project: string | undefined
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