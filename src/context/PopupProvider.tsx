import { ArrowDownFromLine, Eye } from 'lucide-react';
import { title } from 'process';
import React, { createContext, useContext, useState } from 'react';

type PopupOptions = {
    title?: string;
    type: "confirm" | "multiple-select" | "multiple-select-confirm";
    message?: string;
    confirmText?: string;
    cancelText?: string;
    position?: "top-left" | "top" | "top-right" | "center-left" | "center" | "center-right" | "bottom-left" | "bottom" | "bottom-right";
    timer?: number;
    dismissable?: boolean;
    multiple_options?: string[];
};

type PopupArguments = {
    confirmed: boolean, selected?: string
}

type PopupContextType = {
    show: (options: PopupOptions) => Promise<PopupArguments>;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
    const ctx = useContext(PopupContext);
    if (!ctx) throw new Error('usePopup must be used within PopupProvider');
    return ctx;
};

let externalShow: (options: PopupOptions) => Promise<PopupArguments>;

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [options, setOptions] = useState<PopupOptions | null>(null);
    const [resolver, setResolver] = useState<((result: PopupArguments) => void) | null>(null);
    const [isDropDown, setIsDropDown] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const show = (opts: PopupOptions) => new Promise<PopupArguments>((resolve) => {
        setOptions(opts);
        setResolver(() => resolve);
    });

    externalShow = show;

    const handleConfirm = () => {
        setOptions(null);
        resolver?.({ confirmed: true, selected });
    };

    const handleCancel = () => {
        setOptions(null);
        resolver?.({ confirmed: false, selected });
    };

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        if ('target' in e && e.target instanceof HTMLInputElement) {
            setSelected((e as React.ChangeEvent<HTMLInputElement>).target.value)

        } else if (e.target instanceof HTMLDivElement) {
            setSelected(e.currentTarget.id)

        }

        if (options?.type === "multiple-select") {
            handleConfirm();
        }
    };

    const buttons = () => (
        <>
            {options && options.type !== "multiple-select" &&
                <div className="flex justify-around pt-2 select-none">
                    <button
                        className="px-4 py-1 hover:bg-red-500 border border-neutral-300 rounded cursor-pointer"
                        onClick={handleConfirm}
                    >
                        {options.confirmText || 'OK'}
                    </button>
                    {(options.cancelText || options.type === "multiple-select-confirm") &&
                        <button
                            className="px-4 py-1 hover:bg-[#ffffff44] border border-neutral-300 rounded cursor-pointer "
                            onClick={handleCancel}
                        >
                            {options.cancelText}
                        </button>
                    }
                </div>}
        </>
    );

    return (
        <PopupContext.Provider value={{ show }}>
            {children}
            {options && (
                <div
                    onClick={() => options.dismissable ? handleCancel() : undefined}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
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

                        {/* CONFIRM AND CANCEL */}
                        {options.type === "confirm" &&
                            <div className='p-6 pt-2 space-y-4 text-center'>
                                {options.title &&
                                    <h2 className="truncate text-lg font-semibold">{options.title}</h2>
                                }
                                {options.message && <p>{options.message}</p>}
                                {buttons()}
                            </div>
                        }

                        {/* BOTH MULTIPLE SELECT */}
                        {(options.type === "multiple-select" || options.type === "multiple-select-confirm") &&
                            <div className='p-6 pt-0 space-y-4 text-center'>
                                {options.title &&
                                    <h2 className="truncate text-lg font-semibold">{options.title}</h2>
                                }
                                {/* <div className="flex justify-center gap-1 pt-2"> */}

                                <div className='flex-row mb-10'>
                                    <div className='w-full text-xs ml-2'>
                                        {options.message && <p>{options.message}</p>}
                                    </div>

                                    {/* DROPDOWN */}
                                    {options.multiple_options !== undefined &&
                                        <div
                                            onClick={() => setIsDropDown(!isDropDown)}
                                            className='mt-3 relative flex-col text-sm py-0.5 mx-auto outline-1 bg-neutral-800 select-none cursor-pointer w-3/4'
                                        >
                                            <div className="flex">
                                                {/* <Eye className="my-auto ml-3" width={20} height={20} /> */}
                                                <div
                                                    className='px-3 py-1 bg-transparent w-full outline-0 focus:outline-offset-0 truncate'
                                                    id="visibility"
                                                >
                                                    {selected || "-"}
                                                </div>
                                                <ArrowDownFromLine
                                                    className={`my-auto mr-3 origin-center ${isDropDown && "-rotate-180"}`}
                                                    width={20} height={20}
                                                />
                                            </div>

                                            {isDropDown &&
                                                <div className="absolute border-t-0 border border-neutral-300 w-[calc(100%+2px)] -left-[1px] bg-neutral-800">
                                                    {
                                                        options.multiple_options.map((value) =>
                                                            <div
                                                                className="pl-2 py-1 hover:bg-neutral-700 truncate"
                                                                onClick={(e) => handleSelect(e)}
                                                                id={value}
                                                                key={value}
                                                            >
                                                                {value}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>

                                {/* </div> */}
                                {buttons()}
                            </div>
                        }

                    </div>
                </div>
            )}
        </PopupContext.Provider>
    );
};

export const showPopup = (options: PopupOptions) => externalShow(options);