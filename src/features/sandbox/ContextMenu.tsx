import { NodeModel } from "@minoru/react-dnd-treeview";
import { FileMetaData } from "./FileViewer";
import { useDispatch } from "react-redux";
import { RefObject, useRef, useState } from "react";

const ContextMenu: React.FC<{ selectedRef: RefObject<HTMLElement | null> | undefined, selectedNodeModel: NodeModel<FileMetaData> | null }> = ({ selectedRef, selectedNodeModel }) => {

    return (
        <>
        </>
    );

};

export default ContextMenu;