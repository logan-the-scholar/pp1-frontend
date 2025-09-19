import { DBType } from '@/types/Database.type';
import { IDBPDatabase } from 'idb';
import { Repository } from './Repository';
import { DeclaredNodeModel, OpenFile, OpenFilesType } from '@/types/ReduxState.type';

export class OpenTabsRepository extends Repository {

    constructor() {
        super();
    }


    async saveOpen(state: OpenFile | OpenFile[], project_id: string) {

        if (state instanceof Array) {
            const tx = (await this.dbPromise).transaction("selected", "readwrite");
            await Promise.all([
                ...state.map(f => tx.store.put({
                    project_id,
                    id: f.id.toString(),
                    // line: 1,
                    // column: 1,
                    // isSaved: f.data.saved,
                    // isEdited: f.data.edited
                })),
                tx.done
            ]);

        } else {
            await (await this.dbPromise).put("selected", {
                project_id,
                id: state.id.toString(),
                // line: 1,
                // column: 1,
                // isSaved: state.data.saved,
                // isEdited: state.data.edited
            });

        }

    }


    async saveSelected(id: string, project_id: string) {
        await (await this.dbPromise).put("selected_current", { project_id, id });
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


    async remove(id: string) {
        await (await this.dbPromise).delete("selected", id);
    }
}