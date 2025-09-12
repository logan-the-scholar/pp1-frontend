import { DbPackageType } from "@/types/Database.type";
import { Repository } from "./Repository";

export class PackageRepository extends Repository {

    constructor() {
        super();
    }

    async save(toSave: { package: string, version: string, files: DbPackageType[] }) {
        await (await this.dbPromise).put("package", { ...toSave, package: toSave.package + ":" + toSave.version });
    }

    async clear() {
        await (await this.dbPromise).clear("package");
    }

    async remove(path: string) {
        await (await this.dbPromise).delete("package", path);
    }

    async get(path: string, ver: string) {
        const data = await (await this.dbPromise).get("package", path + ":" + ver);
        return data !== undefined && data?.files.length > 0 ? data : undefined;
    }
}