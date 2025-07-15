import { DBSchema } from "idb";
import { ApiType } from "./ApiResponse.type";
import { FileModifStatus } from "./enum/FileModifStatus.enum";

export type FileStatus = {
  id: string;
  status: FileModifStatus;
  isDropped?: boolean;

}

export type SelectedFile = {
  id: string;
  line: number;
  column: number;
  isSaved: boolean;
}

export type ProjectStatus = {
  id: string;
  open: string;
  files: FileStatus[];
}

export type ProjectSelectedData = {
  id: string;
  files: SelectedFile[];
  selected: string;
}

export interface DBType extends DBSchema {
  files: {
    value: ApiType.File;
    key: string;
  };

  status: {
    value: ProjectStatus;
    key: string;
  };

  selected: {
    value: ProjectSelectedData;
    key: string;
  }
}