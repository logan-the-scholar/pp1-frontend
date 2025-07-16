import { FileTree, TreeFileData } from '@/types/Database.type';
import { Repository } from './Repository';

export class FileTreeRepository extends Repository {

    constructor() {
        super();
    }

    async save(file: FileTree, id: string) {
        const data = await this.get(id);

        if (data !== undefined) {
            await (await this.dbPromise).put("status", { ...data, files: [...data.files, file] });
        } else {
            await (await this.dbPromise).put("status", {
                id: id,
                files: [file],
            });
        }
    }

    async clear() {
        await (await this.dbPromise).clear("status");
    }

    async get(id: string) {
        const data: TreeFileData | undefined = await (await this.dbPromise).get("status", id);

        return data !== undefined && data?.files.length > 0 ? data : undefined;
    }

    async remove(id: string) {
        await (await this.dbPromise).delete("status", id);
    }
}
