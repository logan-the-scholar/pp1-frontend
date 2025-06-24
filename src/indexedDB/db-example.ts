import { ApiType } from '@/types/ApiResponse.type';
import { openDB } from 'idb';

const fileStore = "fileStore"

const dbPromise = openDB('pp1', 1, {
    upgrade(db) {
        db.createObjectStore(fileStore, { keyPath: 'id' });
    },
});

async function save(file: ApiType.File) {
    const db = await dbPromise;
    await db.put(fileStore, file);
}

async function clear() {

}

async function get(id: string) {
    const db = await dbPromise;
    return await db.get(fileStore, id);
}

async function remove(id: string) {
    const db = await dbPromise;
    await db.delete(fileStore, id);
}

export const Files = { save, get, remove, clear };