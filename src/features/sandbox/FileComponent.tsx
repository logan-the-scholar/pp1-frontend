import { NodeModel } from "@minoru/react-dnd-treeview";
import { Folder, FolderOpen } from "lucide-react";

const FileComponent: React.FC<{ node: NodeModel<{ fileType: string }>, isOpen: boolean | undefined }> = ({ node, isOpen }) => {
    // "ts", "js", "tsx", "json", 
    const ICON_SIZE = 16;

    return (
        <>
            <span className="mr-1.5 flex mt-[2px]">
                {
                    (() => {
                        switch (node.data?.fileType) {
                            case "ts":
                                return (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 128 128" fill="#007acc" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                        <path d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1A23 23 0 0180 109.19c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10-.12 22-.1h21.81z"></path>
                                    </svg>
                                );

                            case "json":
                                return (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-braces-icon lucide-braces text-yellow-500">
                                        <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
                                    </svg>
                                );

                            case "folder":
                                return isOpen ?
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                        <FolderOpen className="ml-0.5" strokeWidth={1.5} size={18} />
                                    </>
                                    :
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right">
                                            <path d="m9 18 6-6-6-6" />
                                        </svg>
                                        <Folder className="ml-0.5" strokeWidth={1.5} size={18} />
                                    </>
                                    ;

                            default:
                                return (
                                    <svg xmlns="http://www.w3.org/2000/svg" width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-text-icon lucide-text">
                                        <path d="M15 18H3" /><path d="M17 6H3" /><path d="M21 12H3" />
                                    </svg>
                                );

                        }
                    })()
                }
            </span>
            {node.text}

            {/* {node.droppable && (
                                    <span className="mr-1 flex">
                                        {isOpen ?
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                                                <FolderOpen className="ml-0.5" strokeWidth={1.5} size={18} />
                                            </>
                                            :
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
                                                <Folder className="ml-0.5" strokeWidth={1.5} size={18} />
                                            </>
                                        }
                                    </span>
                                )}
                                {node.text} */}
        </>
    );
};

export default FileComponent;