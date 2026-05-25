"use client";
import { PopupProvider } from "@/context/PopupProvider";
import PreMain from "@/features/sandbox/PreMain";
import { use } from "react";

function Branch({ params, searchParams }: { params: Promise<{ id: string, branch: string }>, searchParams: Promise<any> }) {
    const { id, branch } = use(params);

    return (
        <PopupProvider>
            <PreMain id={id} branch={branch} />
        </PopupProvider>
    );
}

export default Branch;