import { LucideProps, Sparkle, Sparkles } from "lucide-react";
import { DOMAttributes, ForwardRefExoticComponent, MouseEventHandler, RefAttributes, useState } from "react";


type attributes = {
    onClick?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    // onHover?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    onHover?: React.FC;
};

const NavButton: React.FC<{ className?: string, overwrite?: boolean, children: any, attributes?: attributes }> = ({ children, className, attributes, overwrite = false }) => {
    const [hover, setHover] = useState<boolean>(false);
    const [click, setClick] = useState<boolean>(false);

    return (
        <button
            onClick={() => setClick(!click)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={overwrite ?
                className
                :
                // `hover:outline-2 hover:outline-offset-4 max-h-5/6 hover:outline-solid h-fit py-2 px-3 inline-block bg-gradient-to-br from-[#fa9726] via-[#ca2f2d] to-[#cf207b] cursor-pointer rounded-3xl ${className !== undefined ? ` ${className}` : ""}`
                `hover:outline-2 hover:outline-offset-4 max-h-5/6 hover:outline-solid h-fit py-2 px-3 inline-block bg-gradient-to-br cursor-pointer ${className !== undefined ? ` ${className}` : ""}`
            }
        >
            {hover && attributes?.onHover ? attributes?.onHover({}) : null}
            {children}
        </button >
    );
};

export default NavButton;