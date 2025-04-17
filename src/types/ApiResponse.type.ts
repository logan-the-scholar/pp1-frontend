import { UserType } from "./enum/UserRecurrence.enum";
import { UserRecurrence } from "./enum/UserType.enum";

export namespace ApiResponse {

    export interface Login {
        id: string,
        name: string,
        email: string,
        profileImage: string,
        userType: UserType,
        recurrence: UserRecurrence
    }
    
}
