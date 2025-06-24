import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

export class ErrorHelper extends Error {
    error: string | undefined;
    
    constructor(public message: string, public exception?: string) {
        super(message);
        this.name = "ErrorHelper";
        this.error = exception;
    }

    isValid(): boolean {
        return Object.values(ApiStatusEnum).includes(this.message as ApiStatusEnum);
    }
}

// export function verifyError(message: string): ApiStatusEnum | string {
//     const is_status = Object.values(ApiStatusEnum).includes(message as ApiStatusEnum);
    
//     if (is_status) {
//         return message as ApiStatusEnum;
//     } else {
//         return message;
//     }
// }