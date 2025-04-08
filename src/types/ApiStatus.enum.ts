export enum ApiStatusEnum {
    TOKEN_EXPIRED = "Token expired, request a new one",
    USER_DELETED = "This user was deleted",
    NOT_ALLOWED_HERE = "You are not allowed here",
    UNKNOWN = "Unknown error",

    WINDOW_CLOSED_BY_USER = "The user closed the window",
    WINDOW_FAILED_TO_OPEN = "The window could not be opened",
}