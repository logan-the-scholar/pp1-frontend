import { Editor } from "@monaco-editor/react";

const RightSide: React.FC = () => {

    return (
        <div className="w-2xs h-48">
            <Editor language="javascript" theme="vs-dark"></Editor>
        </div>
    );
};

export default RightSide;