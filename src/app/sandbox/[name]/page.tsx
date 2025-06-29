"use client";
import Main from "@/features/sandbox/Main";
import { store } from "@/redux/store";
import { use } from "react";
import { Provider } from "react-redux";

export default function Sandbox({ params, searchParams }: { params: Promise<{ name: string }>, searchParams: Promise<any> }) {
    const usedParams = use(params);
    // const usedQuery = use(searchParams);

    return (
        <Provider store={store}>
            <Main id={usedParams.name} />
        </Provider>
    );
}