import { NodeModel } from "@minoru/react-dnd-treeview";
import FileIconMapper from "./FileIconMapper";
import { HTMLAttributes } from "react";
import { DeclaredNodeModel } from "@/types/state-types";
import FileType from "@/types/enum/FileType";

const FileComponent: React.FC<{ node: DeclaredNodeModel<{ fileType: string }>, isOpen: boolean | undefined } & HTMLAttributes<HTMLSpanElement>> = ({ node, isOpen, className }) => {

    return (
        <>
            <span className={`mr-1.5 flex mt-[2px] ${node.data.fileType === FileType.FOLDER && "-ml-3"} ${className || ""}`}>
                <FileIconMapper type={node.data.fileType} isOpen={isOpen} />
            </span>
            {node.text}
        </>
    );
};

export default FileComponent;