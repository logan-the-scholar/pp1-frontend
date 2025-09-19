import { DbPackageType } from "@/types/Database.type";
import { PackageRepository as PackageRepository } from "./database/PackageRepository";
import { fetchCatch } from "./wrapper/fetch-catch";

export async function cacheTypeFrom(monaco: typeof import("monaco-editor"), pkg: string, ver: string) {
    const packageRepository = new PackageRepository();
    const existingPkg = await packageRepository.get(pkg, ver);

    if (existingPkg) {
        // console.log(existingPkg)
        existingPkg.files.forEach(f => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(f.content, f.path);
        });

        // console.log(`${pkg} packages loaded to monaco from cache`);

    } else {

        const res = await fetchCatch(`https://data.jsdelivr.com/v1/package/npm/${pkg}@${ver}`,{});
        if (!res.ok) {
            console.error(`Failed to fetch package ${pkg}`);
            return;
        }

        const meta = await res.json();
        const fileList: DbPackageType[] = [];

        async function loadFiles(files: any[], basePath: string = "") {

            for (const file of files) {
                
                if (file.type === "directory") {
                    await loadFiles(file.files, `${basePath}/${file.name}`);
                    
                } else if (file.name.endsWith(".d.ts")) {
                    const url = `https://cdn.jsdelivr.net/npm/${pkg}${basePath}/${file.name}`;
                    // console.log(file)

                    try {

                        const content = await fetchCatch(url, {}).then((r) => r.text());
                        const path = `file:///node_modules/${pkg}${basePath}/${file.name}`;
                        // console.log(path)
                        // console.log(content)

                        monaco.languages.typescript.typescriptDefaults.addExtraLib(content, path);

                        fileList.push({ path, content });

                    } catch (err) {
                        console.warn(`Error cargando ${url}`, err);

                    }

                    if (fileList.length > 0) {
                        await packageRepository.save({ package: pkg, version: ver, files: fileList });
                    }

                }
            }
        }

        await loadFiles(meta.files);
        // console.log(`${pkg} packages loaded to monaco from jsdelivr`);
    }
    
}