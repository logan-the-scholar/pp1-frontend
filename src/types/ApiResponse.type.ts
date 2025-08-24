import { string } from "zod";
import { UserType } from "./enum/UserRecurrence.enum";
import { UserRecurrence } from "./enum/UserType.enum";

export namespace ApiType {

    export interface Login {
        id: string;
        name: string;
        email: string;
        profileImage: string;
        userType: UserType;
        recurrence: UserRecurrence;
    }

    export interface Workspace {
        id: string;
        name: string;
        owner: string;
    }

    export interface File {
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

    export interface Project {
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

    export interface Branch {
        name: string;
        headId: string;
        draftId: string;
        files: File[];
    }

}
