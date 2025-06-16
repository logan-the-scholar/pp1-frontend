import { UserType } from "./enum/UserRecurrence.enum";
import { UserRecurrence } from "./enum/UserType.enum";

export namespace ApiType {

    export interface Login {
        id: string,
        name: string,
        email: string,
        profileImage: string,
        userType: UserType,
        recurrence: UserRecurrence
    }

    export interface Workspace {
        id: string
        name: string,
        owner: string
    }

    export interface Project {
        id: string,
        name: string,
        visibility: "PUBLIC" | "PRIVATE",
        last_edited?: number | undefined,
        //TODO agregar creador del proyecto si es que se va a usar la invitacion a workspaces...
        //created_by?: string | undefined
    }

}
