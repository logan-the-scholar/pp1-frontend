import { DBSchema } from "idb";
import { FileModifStatus } from "./enum/FileModifStatus.enum";

export type FileTree = {
  id: string;
  status: FileModifStatus;
  isDropped?: boolean;
}

export type FileTab = {
  project_id: string;
  id: string;
  line: number;
  column: number;
  isSaved: boolean;
  isEdited: boolean;
}

export type TreeFileData = {
  id: string;
  files: FileTree[];
}

export interface DBType extends DBSchema {
  status: {
    value: TreeFileData;
    key: string;
  };

  selected: {
    value: FileTab;
    key: string;
    indexes: {
      reference: string;
    };
  }

  selected_current: {
    value: {
      id: string;
      selected: string;
    };
    key: string;
  }
}