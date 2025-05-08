import { NodeModel } from "@minoru/react-dnd-treeview"

export type FileMetaData = {
    fileType: string,
    fullPath?: string[] | number[],
    pathNames?: string[],
    content?: string,
    line?: number,
    isDropped?: boolean,
}

export type OpenFileMetaData = FileMetaData & {
    edited: boolean,
    saved: boolean,
}

export type DeclaredNodeModel<T> = NodeModel & {
    data: T
};