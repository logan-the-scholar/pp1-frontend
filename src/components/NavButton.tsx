import { LucideProps, Sparkle, Sparkles } from "lucide-react";
import { DOMAttributes, ForwardRefExoticComponent, MouseEventHandler, RefAttributes, useState } from "react";

type attributes = {
    onClick?: () => any;//ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    onHover?: React.FC;
};

/** UNUSED component */
const NavButton: React.FC<{ className?: string, overwrite?: boolean, children: any } & attributes> = ({ children = false, className, onHover, onClick, overwrite = false }) => {
    const [hover, setHover] = useState<boolean>(false);
    const [click, setClick] = useState<boolean>(false);

    return (
        <button
            onClick={() => {
                setClick(!click);
                if (onClick !== undefined)
                    onClick();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={overwrite ?
                className
                :
                "cursor-pointer"// `pb-[1px] pr-[1px] relative cursor-pointer border-none rounded-[0.75em] text-white bg-neutral-400 w-fit h-fit ${className !== undefined ? ` ${className}` : ""}`
            }
        >
            {hover && onHover ? onHover({}) : null}
            {children}
        </button >
    );
};

export default NavButton;