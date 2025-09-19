import { DBSchema } from "idb";
import { FileModifStatus } from "./enum/FileModifStatus.enum";

export type FileTree = {
  id: string;
  status: FileModifStatus;
  isDropped?: boolean;
}

export type DbFileTabType = {
  project_id: string;
  id: string;
  // line: number;
  // column: number;
  // isSaved: boolean;
  // isEdited: boolean;
}

export type DbTreeFileDataType = {
  id: string;
  files: FileTree[];
}

export type DbPackageType = {
  content: string,
  path: string
}

export interface DBType extends DBSchema {
  status: {
    value: DbTreeFileDataType;
    key: string;
  };

  selected: {
    value: DbFileTabType;
    indexes: {
      reference: string;
    };
    key: string;
  };

  selected_current: {
    value: DbFileTabType;
    // value: {
    //   id: string;
    //   selected: string;
    // };
    key: string;
  };

  package: {
    value: {
      package: string,
      version: string,
      files: DbPackageType[]
    };
    key: string;
  }
}