import { z } from "zod";
import { StorageSession } from "./zTypes/Login.type";
import { StorageWorkspace } from "./zTypes/Workspace.type";
import { StorageWorkspaces } from "./zTypes/Workspaces.type";

export namespace ApiType {

    // export type Login = {
    //     id: string;
    //     name: string;
    //     email: string;
    //     profileImage: string;
    //     userType: UserType;
    //     recurrence: UserRecurrence;
    // }

    export type Session = z.infer<ReturnType<typeof StorageSession>>;

    export type Workspace = z.infer<ReturnType<typeof StorageWorkspace>>;

    export type Workspaces = z.infer<ReturnType<typeof StorageWorkspaces>>;

    export type File = {
        id: string;
        name: string;
        author: string;
        path: string[];
        //pathNames: string[];
        parent: string;
        extension: string;
        content?: string;
        moved_from?: string;
        commitId: string;
        isDrafted: boolean;
    }

    export type Project = {
        id: string;
        name: string;
        visibility: "PUBLIC" | "PRIVATE";
        branches: string[];
        //last_edited?: number | undefined;
        //TODO agregar creador del proyecto si es que se va a usar la invitacion a workspaces...
        //created_by?: string | undefined;
        //files: File[] | null;
        members?: any;
    }

    export type Branch = {
        name: string;
        headId: string;
        draftId: string;
        files: File[];
    }

}
