import { z } from "zod";
import { StorageWorkspace } from "./Workspace.type";

export const StorageWorkspaces = () => z.array(StorageWorkspace());