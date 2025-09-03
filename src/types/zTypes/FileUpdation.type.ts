import { z } from "zod";
import { Path } from "./Path.type";

export const FileUpdation = () => Path().extend({

    repoId: z.string().uuid("project id must be a valid uuid"),

    id: z.string(),

    author: z.string({ message: "author name can't be empty" }).min(4).max(30),

    newName: z.string().nullable(),

    content: z.string().nullable(),

    newExtension: z.string().nullable(),

    newPath: z.array(z.string()).nullable(),

    createdAt: z.number({ message: "update date must be a timestamp number" }),

    branch: z.string().min(4, "branch lenght must be between 1-20 characters").max(20, "branch lenght must be between 1-20 characters"),
});