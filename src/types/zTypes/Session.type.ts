import { z } from "zod";
import { UserRegistration } from "./UserRegistration.type";

export const Session = () => UserRegistration().innerType().pick({ mail: true, nickname: true }).extend({
    picture: z.string().url().optional(),
});