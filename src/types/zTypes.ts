import { z } from "zod";
import { UserCredentials } from "./UserCredentials.type";
import { UserRegistration } from "./UserRegistration.type";

export type IUserCredentials = z.infer<ReturnType<typeof UserCredentials>>;

export type IUserRegistration = z.infer<ReturnType<typeof UserRegistration>>;