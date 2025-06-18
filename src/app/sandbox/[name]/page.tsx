"use client";
import ContentSideBar from "@/features/sandbox/ContentSideBar";
import EditorNavBar from "@/features/sandbox/EditorNavBar";
import FileViewer from "@/features/sandbox/FileViewer";
import Preview from "@/features/sandbox/Preview";
import { store } from "@/redux/store";
import { use } from "react";
import { Provider } from "react-redux";

export default function Sandbox({ params }: {params: Promise<{ name: string }>}) {
    const data = use(params);

    return (
        <>
            <Provider store={store}>
                <div className="flex flex-col w-full h-[100vh]">
                    <div className="w-full h-10 bg-neutral-900">
                        <EditorNavBar/>
                    </div>
                    <div className="w-full flex-1 flex bg-neutral-900">
                        <ContentSideBar/>
                        <FileViewer name={data.name}/>
                        <Preview/>
                    </div>
                </div>
            </Provider>
        </>
    );
}