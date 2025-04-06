import { UserCredentials } from "./UserCredentials.type";
import { z } from "zod";

export const UserRegistration = () => UserCredentials().extend({
    nickname: z
        .string()
        .min(3, "Nickname must be longer than 3 characters")
        .max(20, "This nickname is too long")
        .regex(
            /^[a-zA-Z\s]+$/,
            "Nickname must contain alphanumeric space or _ characters"
        ),

    confirm_password: z.string(),

}).refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords must match",
});