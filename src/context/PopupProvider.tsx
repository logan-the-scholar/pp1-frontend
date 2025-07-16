import React, { createContext, useContext, useState } from 'react';

type PopupOptions = {
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    position?: "top-left" | "top" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom" | "bottom-right"
    timer?: number,
};

type PopupContextType = {
    show: (options: PopupOptions) => Promise<boolean>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
    const ctx = useContext(PopupContext);
    if (!ctx) throw new Error('usePopup must be used within PopupProvider');
    return ctx;
};

let externalShow: (options: PopupOptions) => Promise<boolean>;

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [options, setOptions] = useState<PopupOptions | null>(null);
    const [resolver, setResolver] = useState<((result: boolean) => void) | null>(null);

    const show = (opts: PopupOptions) => new Promise<boolean>((resolve) => {
        setOptions(opts);
        setResolver(() => resolve);
    });

    externalShow = show;

    const handleConfirm = () => {
        setOptions(null);
        resolver?.(true);
    };

    const handleCancel = () => {
        setOptions(null);
        resolver?.(false);
    };

    return (
        <PopupContext.Provider value={{ show }}>
            {children}
            {options && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1e1e1e] rounded shadow max-w-sm w-full">
                        <div className="w-full content-end flex">
                            <div
                                className='ml-auto cursor-pointer hover:bg-red-500 p-1 rounded'
                                onClick={handleCancel}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="lucide lucide-x-icon lucide-x"
                                    width="20" height="20"
                                    viewBox="0 0 24 24"
                                    color='#ffffff'
                                    fill="none"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                </svg>
                            </div>
                        </div>

                        <div className='p-6 pt-2 space-y-4 text-center'>
                            <h2 className="text-lg font-semibold">{options.title}</h2>
                            {options.message && <p>{options.message}</p>}
                            <div className="flex justify-center gap-4 pt-2">
                                {options.cancelText && (
                                    <button
                                        className="px-4 py-1 border border-neutral-300 rounded cursor-pointer"
                                        onClick={handleCancel}
                                    >
                                        {options.cancelText}
                                    </button>
                                )}
                                <button
                                    className="px-4 py-1 bg-red-500 text-white rounded cursor-pointer"
                                    onClick={handleConfirm}
                                >
                                    {options.confirmText || 'OK'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
};

export const showPopup = (options: PopupOptions) => externalShow(options);