import { ErrorHelper } from "@/helpers/ErrorHelper";
import { ApiStatusEnum } from "@/types/enum/ApiStatus.enum";

/** Fetch and catch the backend response in case of error, formating it to an `ApiStatusEnum` error */
export async function fetchCatch(url: string | URL | globalThis.Request, options: RequestInit) {
    try {
        const response: Response = await fetch(url, { ...options });

        if (response.status === 401) {
            throw new ErrorHelper(ApiStatusEnum.TOKEN_EXPIRED, "401");
        } else if (!response.ok) {
            const data = await response.json()
            throw new ErrorHelper(data.message, data.status).verifyOrThrow(ApiStatusEnum.UNKNOWN);
        }

        return response;
        
    } catch (error: any) {

        if(error.message !== null && (error.message as string).includes("NetworkError")) {
            console.error(error);
            throw new ErrorHelper(ApiStatusEnum.NETWORK_ERROR, "500");
        }

        throw error;
    }
}
