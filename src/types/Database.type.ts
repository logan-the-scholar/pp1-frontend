import { DBSchema } from "idb";
import { ApiType } from "./ApiResponse.type";

export default interface DBType extends DBSchema {
//   'favourite-number': {
//     key: string;
//     value: number;
//   };
  files: {
    value: ApiType.File;
    key: string;
    // indexes: { 'by-price': number };
  };
}