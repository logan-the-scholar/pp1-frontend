"use client";
import CodeViewer from "@/features/sandbox/CodeViewer";
import EditorNavBar from "@/features/sandbox/EditorNavBar";
import FileViewer from "@/features/sandbox/FileViewer";
import { Editor } from "@monaco-editor/react";

export default function Sandbox() {
    return (
        <>
            <EditorNavBar />
            <div className="flex w-full h-[100vh] bg-neutral-900">
                <FileViewer />
                <CodeViewer />
            </div>
        </>
    );
}