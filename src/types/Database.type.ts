import { DBSchema } from "idb";
import { ApiType } from "./ApiResponse.type";
import { FileModifStatus } from "./enum/FileModifStatus.enum";

export type FileStatus = {
  id: string;
  status: FileModifStatus;
  isDropped?: boolean;

}

export type SelectedFileData = {
  id: string;
  line: number;
  column: number;
  isSaved: boolean;
}

export interface DBType extends DBSchema {
  files: {
    value: ApiType.File;
    key: string;
  };

  status: {
    value: FileStatus;
    key: string;
  };

  selected: {
    value: SelectedFileData;
    key: string;
  }
}