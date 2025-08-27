import { Repository } from './Repository';
import { DeclaredNodeModel, OpenFileMetaData, OpenFilesType } from '@/types/state-types';

export class OpenTabsRepository extends Repository {

    constructor() {
        super();
    }


    async save(state: DeclaredNodeModel<OpenFileMetaData> | DeclaredNodeModel<OpenFileMetaData>[], project_id: string) {

        if (state instanceof Array) {
            const tx = (await this.dbPromise).transaction("selected", "readwrite");
            await Promise.all([
                ...state.map((f) => tx.store.put({
                    project_id,
                    id: f.id.toString(),
                    line: 1,
                    column: 1,
                    isSaved: f.data.saved,
                    isEdited: f.data.edited
                })),
                tx.done
            ]);

        } else {
            await (await this.dbPromise).put("selected", {
                project_id,
                id: state.id.toString(),
                line: 1,
                column: 1,
                isSaved: state.data.saved,
                isEdited: state.data.edited
            });

        }

    }


    async saveSelected(id: string, projectId: string) {
        await (await this.dbPromise).put("selected_current", { id: projectId, selected: id });
    }


    async getSelected(id: string) {
        const data = await (await this.dbPromise).get("selected_current", id);
        return data;
    }


    async clear() {
        await (await this.dbPromise).clear("selected");
        await (await this.dbPromise).clear("selected_current");
    }


    async get(id: string) {
        const store = (await this.dbPromise).transaction("selected").objectStore("selected");
        const index = store.index("reference");
        const data = await index.getAll(id);

        return data !== undefined && data?.length > 0 ? data : undefined;
    }


    async remove(id: string, fileId: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}
