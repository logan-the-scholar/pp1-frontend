import { z } from "zod";
import { UserType } from "../enum/UserRecurrence.enum";
import { UserRecurrence } from "../enum/UserType.enum";

export const StorageSession = () => z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    profileImage: z.string().url(),
    userType: z.nativeEnum(UserType),
    recurrence: z.nativeEnum(UserRecurrence)
})