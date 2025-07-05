import { ApiType } from '@/types/ApiResponse.type';
import { DBType, FileStatus, SelectedFileData } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class Repository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('files')) {
                    db.createObjectStore("files", { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains("selected")) {
                    db.createObjectStore("selected", { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains("status")) {
                    db.createObjectStore("status", { keyPath: 'id' });
                }
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

    async save2(file: FileStatus) {
        await (await this.dbPromise).put("status", file);
    }

    async clear2() {
        await (await this.dbPromise).clear("status");
    }

    // async get(id: string) {
    //     return await (await this.dbPromise).get("status", id);
    // }

    async getAll2(ids: string[]) {
        const data: FileStatus[] = await (await this.dbPromise).getAll("status");
        return data.length > 0 ? data : undefined;
    }

    async remove2(id: string) {
        await (await this.dbPromise).delete("status", id);
    }

        async save3(file: SelectedFileData) {
        await (await this.dbPromise).put("selected", file);
    }

    async clear3() {
        await (await this.dbPromise).clear("selected");
    }

    // async get(id: string) {
    //     return await (await this.dbPromise).get("selected", id);
    // }

    async getAll3(ids: string[]) {
        const data: SelectedFileData[] = await (await this.dbPromise).getAll("selected");
        return data.length > 0 ? data : undefined;
    }

    async remove3(id: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}