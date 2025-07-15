import { DBType } from '@/types/Database.type';
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
}