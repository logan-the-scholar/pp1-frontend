import { ApiType } from '@/types/ApiResponse.type';
import { DBType, FileStatus } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class FileStatusRepository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1', 1, {
            upgrade(db) {
                db.createObjectStore("status", { keyPath: 'id' });
            },
        });
    }

    async save(file: FileStatus) {
        await (await this.dbPromise).put("status", file);
    }

    async clear() {
        await (await this.dbPromise).clear("status");
    }

    // async get(id: string) {
    //     return await (await this.dbPromise).get("status", id);
    // }

    async getAll(ids: string[]) {
        await (await this.dbPromise).getAll("status");
    }

    async remove(id: string) {
        await (await this.dbPromise).delete("status", id);
    }
}