import { jetBrainsMono } from "@/helpers/Fonts";

const LeftSide: React.FC = () => {

    return (
        <div className="not-md:w-fit md:max-w-[40%] md:w-[40%] h-2/3 my-auto border-neutral-800 border-[1px] bg-[#050505] px-3 py-2">
            <h1 className={`${jetBrainsMono.className} text-3xl font-bold`}>Providing a fast & easy online pair programming environment</h1>
            <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus, iusto repellendus praesentium labore aperiam odio facilis ad alias at quibusdam voluptatum similique consequuntur commodi harum inventore quisquam nemo ea sint!</div>
            <div className="bg-[#050505] w-fit h-fit pb-1 pr-1 shadow-[4px_4px_0px_#fdc700] hover:scale-105 mt-3 m-auto rounded-b-lg rounded-r-lg transition-all duration-200">
                <button className="bg-[#F1500E] text-[#050505] text-center border border-[#f1500e] p-2 w-fit rounded-b-lg rounded-r-lg cursor-pointer transition-all duration-200">Code Trial</button>
            </div>
        </div>
    );
};

export default LeftSide;