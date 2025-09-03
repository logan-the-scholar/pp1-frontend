import { z } from "zod";
import { UserCredentials } from "./UserCredentials.type";
import { UserRegistration } from "./UserRegistration.type";
import { ProjectCreation } from "./ProjectCreation.type";
import { FileCreation } from "./FileCreation.type";
import { FileUpdation } from "./FileUpdation.type";
import { Session } from "./Session.type";

export type IUserCredentials = z.infer<ReturnType<typeof UserCredentials>>;

export type IUserRegistration = z.infer<ReturnType<typeof UserRegistration>>;

export type IProjectCreation = z.infer<ReturnType<typeof ProjectCreation>>;

export type IFileCreation = z.infer<ReturnType<typeof FileCreation>>;

export type IFileUpdation = z.infer<ReturnType<typeof FileUpdation>>;
//TODO posible idea: pasar esto a un tipado especifico que pueda referenciar la "key" usada en localStorage
export type ISession = z.infer<ReturnType<typeof Session>>