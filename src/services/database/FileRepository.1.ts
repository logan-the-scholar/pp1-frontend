import { ApiType } from '@/types/ApiResponse.type';
import { Repository } from './Repository';

export class FileRepository extends Repository {

    constructor() {
        super();
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
