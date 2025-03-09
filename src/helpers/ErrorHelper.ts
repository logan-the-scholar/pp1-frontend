import { ApiStatusEnum } from "@/types/ApiStatus.enum";

export class ErrorHelper extends Error {
    error: string | undefined;
    
    constructor(public message: string, public exception?: string) {
        super(message);
        this.name = "ErrorHelper";
        this.error = exception;
    }

    verifyOrThrow(message: string): ErrorHelper {
        const is_status = Object.values(ApiStatusEnum).includes(this.message as ApiStatusEnum);
            
        if (!is_status) {
            this.message = message;
        } 
        
        return this;
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