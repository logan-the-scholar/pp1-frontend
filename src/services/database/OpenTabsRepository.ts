import { DbFileTabType, DBSelectedTabType } from '@/types/Database.type';
import { Repository } from './Repository';

export class OpenTabsRepository extends Repository {

    constructor() {
        super();
    }


    async saveOpen(state: DbFileTabType | DbFileTabType[], project_id: string) {

        if (state instanceof Array) {
            const tx = (await this.dbPromise).transaction("open", "readwrite");
            await Promise.all([
                ...state.map(f => tx.store.put({
                    project_id,
                    id: f.id,
                    line: 1,
                    saved: f.saved,
                    edited: f.edited,
                    // column: 1,
                })),
                tx.done
            ]);

        } else {
            await (await this.dbPromise).put("open", {
                project_id,
                id: state.id,
                line: 1,
                // column: 1,
                saved: state.saved,
                edited: state.edited
            });

        }

    }


    async saveSelected(state: DBSelectedTabType) {
        await (await this.dbPromise).put("selected_current", state);
    }


    async getSelected(id: string) {
        const data = await (await this.dbPromise).get("selected_current", id);
        return data;
    }


    async clear(id: string) {
        const db = await this.dbPromise;
        const store = db.transaction("open", "readwrite").objectStore("open");
        const index = store.index("reference");
        const data = await index.getAll(id);

        if (data.length > 0) {
            const tx = store.transaction;
            await Promise.all([
                ...data.map(f => tx.store.delete(f.id)),
                db.delete("selected_current", id),
                tx.done
            ]);
        }
        // await (await this.dbPromise).clear("selected");
        // await (await this.dbPromise).clear("selected_current");
    }


    async get(id: string) {
        const store = (await this.dbPromise).transaction("open").objectStore("open");
        const index = store.index("reference");
        const data = await index.getAll(id);

        return data !== undefined && data?.length > 0 ? data : undefined;
    }


    async remove(id: string) {
        //TODO este se debe cambiar a remover por referencia e id, para evitar eliminar indices de otra session
        await (await this.dbPromise).delete("open", id);
    }


    async unSelect(id: string) {
        await (await this.dbPromise).delete("selected_current", id)
    }
}