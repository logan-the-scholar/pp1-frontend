import { ProjectSelectedData, SelectedFile } from '@/types/Database.type';
import { Repository } from './Repository';

export class SelectedRepository extends Repository {

    constructor() {
        super();
    }

    async save(file: SelectedFile, id: string) {
        const data = await this.get(id);

        if (data !== undefined) {

            data.files.splice(data.files.findIndex((n) => n.id === data.selected) + 1 || 0, 0, file);

            await (await this.dbPromise).put("selected", data);
        } else {
            await (await this.dbPromise).put("selected", {
                id: id,
                files: [file],
                selected: file.id
            });
        }
    }

    async clear() {
        await (await this.dbPromise).clear("selected");
    }

    async get(id: string) {
        const data: ProjectSelectedData | undefined = await (await this.dbPromise).get("selected", id);

        return data !== undefined && data?.files.length > 0 ? data : undefined;
    }

    async remove(id: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}
