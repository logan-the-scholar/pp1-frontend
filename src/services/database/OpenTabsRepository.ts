import { OpenTabsData, FileTab } from '@/types/Database.type';
import { Repository } from './Repository';
import { OpenFilesType } from '@/types/state-types';

export class OpenTabsRepository extends Repository {

    constructor() {
        super();
    }

    async save(state: OpenFilesType, projectId: string) {
        const data = await this.get(projectId);
        console.log(state);
        const mappedFiles: FileTab[] = state.open.map<FileTab>((f) => {
            return {
                id: f.id.toString(),
                line: 1,
                column: 1,
                isSaved: f.data.saved,
            };
        });

        if (data !== undefined) {
            await (await this.dbPromise).put("selected", { id: data.id, files: mappedFiles, selected: state.selected?.id as string });

        } else {
            await (await this.dbPromise).put("selected", {
                id: projectId,
                files: mappedFiles,
                selected: state.selected?.id as string
            });
        }
    }

    async clear() {
        await (await this.dbPromise).clear("selected");
    }

    async get(id: string) {
        const data: OpenTabsData | undefined = await (await this.dbPromise).get("selected", id);

        return data !== undefined && data?.files.length > 0 ? data : undefined;
    }

    async remove(id: string, fileId: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}
