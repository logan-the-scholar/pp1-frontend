"use client";
import CodeViewer from "@/features/sandbox/CodeViewer";
import EditorNavBar from "@/features/sandbox/EditorNavBar";
import FileViewer from "@/features/sandbox/FileViewer";
import { store } from "@/redux/store";
import { Provider } from "react-redux";

export default function Sandbox() {
    return (
        <>
            <Provider store={store}>
                <EditorNavBar />
                <div className="flex w-full h-[100vh] bg-neutral-900">
                    <FileViewer />
                    <CodeViewer />
                </div>
            </Provider >
        </>
    );
}