import { NodeModel } from "@minoru/react-dnd-treeview";
import FileIconMapper from "./FileIconMapper";
import { HTMLAttributes } from "react";

const FileComponent: React.FC<{ node: NodeModel<{ fileType: string }>, isOpen: boolean | undefined } & HTMLAttributes<HTMLSpanElement>> = ({ node, isOpen, className }) => {

    return (
        <>
            <span className={`mr-1.5 flex mt-[2px] ${className || null}`}>
                <FileIconMapper type={node.data?.fileType as string} isOpen={isOpen} />
            </span>
            {node.text}
        </>
    );
};

export default FileComponent;