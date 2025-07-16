"use client";
import { PopupProvider } from "@/context/PopupProvider";
import Main from "@/features/sandbox/Main";
import { store } from "@/redux/store";
import { use, useEffect, useState } from "react";
import { Provider } from "react-redux";

export default function Sandbox({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<any> }) {
    const usedParams = use(params);

    return (
        <>
            {usedParams.id === null ?
                null
                :
                <Provider store={store}>
                    <PopupProvider>
                        <Main id={usedParams.id} />
                    </PopupProvider>
                </Provider>
            }
        </>
    );
}