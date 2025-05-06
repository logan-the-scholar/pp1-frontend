import { FileMetaData } from "@/types/state-types";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { RefObject } from "react";

const ContextMenu: React.FC<{ selectedRef: RefObject<HTMLElement | null> | undefined, selectedNodeModel: NodeModel<FileMetaData> | null }> = ({ selectedRef, selectedNodeModel }) => {

    return (
        <>
        </>
    );

};

export default ContextMenu;