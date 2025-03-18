import { jetBrainsMono } from "@/helpers/Fonts";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const LeftSide: React.FC<{ hidePanelState: boolean, hidePanelTriggerer: Dispatch<SetStateAction<boolean>> }> = ({ hidePanelState, hidePanelTriggerer }) => {
    // const [hide, setHide] = useState<boolean>(false);

    const handleClick = () => {

    };

    return (
        <>
            {hidePanelState &&
                <div
                    className={`h-3/5 my-auto flex ${hidePanelState ? "animate-unshrink" : "animate-shrink"}`}
                    onClick={() => hidePanelTriggerer(false)}
                >
                    <div
                        className="border-l border-neutral-700 my-auto py-3 transition-colors duration-100 ease-in-out cursor-pointer hover:bg-[#52525256]"
                    >
                        <ChevronRight width={60} height={60} />
                    </div>
                </div>
            }
            <div className={`not-md:w-fit md:max-w-[40%] md:w-[40%] h-2/3 mt-6 px-5 py-2 border-l border-r border-neutral-700 ${hidePanelState ? "animate-shrink" : "animate-unshrink"}`}>
                <h1 className={`${jetBrainsMono.className} text-3xl font-bold`}>Fast & easy to use online pair programming tool</h1>
                <div className="mt-2 mb-8">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus, iusto repellendus praesentium labore aperiam odio facilis ad alias at quibusdam voluptatum similique consequuntur commodi harum inventore quisquam nemo ea sint!
                </div>

                <button className="h-fit w-fit relative gradient-1 bg-violet-800 rounded-[0.75em] cursor-pointer">
                    <span className="inline-block box-border hover:-translate-y-[0.33em] mb-[2px] mr-[2px] border hover:-translate-x-[0.2em] active:translate-0 py-[0.6em] px-5 bg-violet-600 border-violet-950 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in">
                        Create Account
                    </span>
                </button>
            </div>

        </>
    );
};

export default LeftSide;