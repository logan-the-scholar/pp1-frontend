import { z } from "zod";
import { UserCredentials } from "./UserCredentials.type";
import { UserRegistration } from "./UserRegistration.type";
import { ProjectCreation } from "./ProjectCreation.type";
import { FileCreation } from "./FileCreation.type";

export type IUserCredentials = z.infer<ReturnType<typeof UserCredentials>>;

export type IUserRegistration = z.infer<ReturnType<typeof UserRegistration>>;

export type IProjectCreation = z.infer<ReturnType<typeof ProjectCreation>>;

export type IFileCreation = z.infer<ReturnType<typeof FileCreation>>;