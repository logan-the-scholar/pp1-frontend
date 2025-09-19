import { useEffect } from "react";

//TODO esto se puede generalizar para crear mas shortcuts facilmente
export const useCtrlShortcut = (key: string, handler: () => void) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const isKeyShortcut = (isMac && e.metaKey && e.key === key) || (!isMac && e.ctrlKey && e.key === key);

            if (isKeyShortcut) {
                e.preventDefault();
                handler();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handler]);
};