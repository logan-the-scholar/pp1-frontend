import { DBType } from '@/types/Database.type';
import { IDBPDatabase, openDB } from 'idb';

export class Repository {

    dbPromise: Promise<IDBPDatabase<DBType>>;

    constructor() {
        this.dbPromise = openDB<DBType>('pp1.2', 3, {
            upgrade(db, oldVersion, newVersion, transaction) {
                if (oldVersion < 3) {
                    if (db.objectStoreNames.contains("selected_current")) {
                        db.deleteObjectStore("selected_current");
                    }
                    db.createObjectStore("selected_current", { keyPath: "id" });
                }

                if (!db.objectStoreNames.contains("open")) {
                    const store = db.createObjectStore("open", { keyPath: 'id' });
                    store.createIndex("reference", "project_id");
                }

                if (!db.objectStoreNames.contains("status")) {
                    db.createObjectStore("status", { keyPath: 'id' });
                }

                // if (!db.objectStoreNames.contains("selected_current")) {
                //     db.createObjectStore("selected_current", { keyPath: "id" });
                // }

                if (!db.objectStoreNames.contains("package")) {
                    db.createObjectStore("package", { keyPath: "package" });
                }
            },
        });
    }
}