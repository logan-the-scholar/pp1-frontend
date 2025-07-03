import { ApiType } from '@/types/ApiResponse.type';
import { DBType } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class FileRepository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1', 1, {
            upgrade(db) {
                db.createObjectStore("files", { keyPath: 'id' });
            },
        });
    }

    async createStore(file: ApiType.File[]) {
        const tx = (await this.dbPromise).transaction("files", 'readwrite');

        await Promise.all([
            ...file.map((file) => tx.store.put(file)),
            tx.done
        ]);
    }

    async save(file: ApiType.File) {
        await (await this.dbPromise).put("files", file);
    }

    async clear() {
        await (await this.dbPromise).clear("files");
    }

    async get(id: string) {
        return await (await this.dbPromise).get("files", id);
    }

    async remove(id: string) {
        await (await this.dbPromise).delete("files", id);
    }
}