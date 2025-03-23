import { jetBrainsMono } from "@/helpers/Fonts";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const LeftSide: React.FC<{ hidePanelState: boolean, hidePanelTriggerer: Dispatch<SetStateAction<boolean>> }> = ({ hidePanelState, hidePanelTriggerer }) => {
    // const [hide, setHide] = useState<boolean>(false);

    const handleClick = () => {

    };

    return (
        <>
            <div
                className={`top-[50%] absolute left-0 h-fit flex ease-in-out ${hidePanelState ? "animate-re-shrink-300" : "animate-shrink-300 cursor-default"}`}
            >
                <div
                    onClick={() => hidePanelTriggerer(false)}
                    className="border-l border-neutral-700 my-auto py-3 transition-colors duration-100 ease-in-out cursor-pointer hover:bg-[#52525256]"
                >
                    <ChevronRight width={60} height={60} />
                </div>
            </div>

            <div className="relative not-md:w-fit md:max-w-[40%] md:w-[40%]">
                <div className={`relative font-bold mt-3 ease-linear animate-direction-50/50 text-3xl ${!hidePanelState ? "animate-re-rise-100/1500" : "animate-rise-1500/1500"}`}>
                    {/* {"<div className='absolute'></div>"} */}
                    Code together
                    <div className="text-base font-normal">
                        In a variety of programming languages—collaborate, create, and learn!
                    </div>
                </div>
                <div className={`absolute flex flex-col px-5 w-full h-4/5 py-2 ease-linear -animate-direction-200/200 ${hidePanelState ? "animate-slide-1500/10" : "animate-re-slide-1500/200"}`}>
                    <h1 className={`${jetBrainsMono.className} text-3xl font-bold`}>Fast & easy to use online pair programming tool</h1>

                    <div className="mt-6 mb-8">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus, iusto repellendus praesentium labore aperiam odio facilis ad alias at quibusdam voluptatum similique consequuntur commodi harum inventore quisquam nemo ea sint!
                    </div>

                    <button className="mt-auto mb-7 self-center h-fit w-fit relative gradient-1 bg-violet-800 rounded-[0.75em] cursor-pointer">
                        <span className="inline-block box-border hover:-translate-y-[0.33em] mb-[2px] mr-[2px] border hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border-violet-950 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                            Create Account
                        </span>
                    </button>
                </div>
            </div>

        </>
    );
};

export default LeftSide;