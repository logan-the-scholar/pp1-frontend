"use client";
import CodeViewer from "@/features/sandbox/CodeViewer";
import ContentSideBar from "@/features/sandbox/ContentSideBar";
import EditorNavBar from "@/features/sandbox/EditorNavBar";
import FileViewer from "@/features/sandbox/FileViewer";
import Preview from "@/features/sandbox/Preview";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function Sandbox() {
    return (
        <>
            <Provider store={store}>
                <div className="flex flex-col w-full h-[100vh]">
                    <div className="w-full h-10 bg-neutral-900">
                        <EditorNavBar />
                    </div>
                    <div className="w-full flex-1 flex bg-neutral-900">
                        {/* <div className="w-full flex bg-neutral-900"> */}
                        <ContentSideBar />
                        <FileViewer />
                        <Preview />
                        {/* <CodeViewer /> */}
                        {/* </div> */}
                    </div>
                </div>
            </Provider >
        </>
    );
}