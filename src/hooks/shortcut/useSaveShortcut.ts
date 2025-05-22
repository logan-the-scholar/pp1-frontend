import { useEffect } from "react";

export const useSaveShortcut = (onSave: () => void) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            const isSaveShortcut = (isMac && e.metaKey && e.key === "s") || (!isMac && e.ctrlKey && e.key === "s");

            if (isSaveShortcut) {
                e.preventDefault();
                onSave();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onSave]);
};