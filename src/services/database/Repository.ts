import { DBType } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class Repository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1', 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("selected")) {
                    const store = db.createObjectStore("selected", { keyPath: 'id' });
                    store.createIndex("reference", "project_id");
                }

                if (!db.objectStoreNames.contains("status")) {
                    db.createObjectStore("status", { keyPath: 'id' });
                }

                if (!db.objectStoreNames.contains("selected_current")) {
                    db.createObjectStore("selected_current", { keyPath: "id" });
                }
                
                if (!db.objectStoreNames.contains("package")) {
                    db.createObjectStore("package", { keyPath: "package" });
                }
            },
        });
    }
}