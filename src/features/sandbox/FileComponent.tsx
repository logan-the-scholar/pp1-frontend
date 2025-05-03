import { NodeModel } from "@minoru/react-dnd-treeview";
import FileIconMapper from "./FileIconMapper";

const FileComponent: React.FC<{ node: NodeModel<{ fileType: string }>, isOpen: boolean | undefined }> = ({ node, isOpen }) => {

    return (
        <>
            <span className="mr-1.5 flex mt-[2px]">
                <FileIconMapper type={node.data?.fileType as string} isOpen={isOpen} />
            </span>
            {node.text}
        </>
    );
};

export default FileComponent;