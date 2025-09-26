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
    id: string
    data: T
}

export type FileTreeType = DeclaredNodeModel<FileMetaData> & { id: string }


export type ProjectMetaType = {
    selected: string | undefined,
    open: string | undefined,
    project: string | undefined,
    branch: string | undefined
}

// export type OpenFile = DeclaredNodeModel<FileMetaData>;
// {
//     id: string;
// }

// export type OpenFilesType = {
//     selected: string | undefined,
//     open: string[]
// }