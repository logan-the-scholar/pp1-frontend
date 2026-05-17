import { z } from "zod";
import { UserRegistration } from "./UserRegistration.type";

export const Session = () => UserRegistration().innerType().pick({ email: true, name: true }).extend({
    picture: z.string().url().optional(),
});