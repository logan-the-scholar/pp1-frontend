import { ApiType } from '@/types/ApiResponse.type';
import { DBType, FileStatus, SelectedFileData } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class FileSelectedRepository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1', 1, {
            upgrade(db) {
                db.createObjectStore("selected", { keyPath: 'id' });
            },
        });
    }

    async save(file: SelectedFileData) {
        await (await this.dbPromise).put("selected", file);
    }

    async clear() {
        await (await this.dbPromise).clear("selected");
    }

    // async get(id: string) {
    //     return await (await this.dbPromise).get("selected", id);
    // }

    async getAll(ids: string[]) {
        await (await this.dbPromise).getAll("selected");
    }

    async remove(id: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}