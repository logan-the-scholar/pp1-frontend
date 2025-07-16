import { DBSchema } from "idb";
import { FileModifStatus } from "./enum/FileModifStatus.enum";

export type FileTree = {
  id: string;
  status: FileModifStatus;
  isDropped?: boolean;
}

export type FileTab = {
  id: string;
  line: number;
  column: number;
  isSaved: boolean;
}

export type TreeFileData = {
  id: string;
  files: FileTree[];
}

export type OpenTabsData = {
  id: string;
  files: FileTab[];
  selected: string;
}


export interface DBType extends DBSchema {
  status: {
    value: TreeFileData;
    key: string;
  };

  selected: {
    value: OpenTabsData;
    key: string;
  }
}