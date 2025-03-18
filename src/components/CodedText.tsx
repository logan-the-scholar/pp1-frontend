import { useEffect } from "react";

const CodedText: React.FC<{ content: string; className?: string, overwrite?: boolean }> = ({ content, className, overwrite }) => {

    useEffect(() => {
        const styleSheet = document.styleSheets[0];

        const values = () => {
            let values_: string[] = [];
            for (let key = 1, e = 1; key < 11; key++) {
                let chars = [];

                for (let i = 1; i <= e; i++) {//se va a sobreescribir buscar una mejor opcion
                    const code = Math.floor(Math.random() * (65 - 33) + 33);
                    chars.push(code);
                }
                e < content.length ? e++ : null;

                values_.push(String.fromCharCode(...chars));
            }
            return values_;
        };

        const val1 = values()

        const val2 = val1.map((x) => {
            return x.split("").reverse().join("");
        }).toReversed();

        const start = "inset-inline-start: var(--spacing2);";
        const end = "inset-inline-end: var(--spacing2);";

        console.log(val1);
        console.log(val2);

        const keyframes = `
        @keyframes coded-animation {
            0 % {
                content: "${val1[0]}";
            }
            
            5% {
                content: "${val1[1]}";
            }

            10% {
                content: "${val1[2]}";
            }

            15% {
                content: "${val1[3]}";
            }

            20% {
                content: "${val1[4]}";
            }

            25% {
                content: "${val1[5]}";
            }

            30% {
                content: "${val1[6]}";
            }

            35% {
                content: "${val1[7]}";
            }

            40% {
                content: "${val1[8]}";
            }

            45% {
                content: "${val1[9]}";
            }

            50% {
                content: "${val1[8]}";
                ${end}
            }

            55% {
                content: "${val2[1]}";
                ${end}
            }

            60% {
                content: "${val2[2]}";
                ${end}
            }

            65% {
                content: "${val2[3]}";
                ${end}
            }

            70% {
                content: "${val2[4]}";
                ${end}
            }

            75% {
                content: "${val2[5]}";
                ${end}
            }

            80% {
                content: "${val2[6]}";
                ${end}
            }

            85% {
                content: "${val2[7]}";
                ${end}
            }

            90% {
                content: "${val2[8]}";
                ${end}
            }

            95% {
                content: "${val2[9]}";
                ${end}
            }

            100% {
                content: "";
                ${end}
            }
          }
        `;

        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }, []);

    return (
        <span
            className={overwrite ?
                className
                :
                ""// `hover:-translate-y-[0.33em] hover:-translate-x-[0.2em] active:translate-0 box-border py-[0.6em] border bg-[#050505] border-neutral-700 rounded-[0.75em] -translate-y-[0.2em] -translate-x-[0.1em] transition-all duration-100 ease-in ${className !== undefined ? `${className}` : ""}`
            }
        >
            {content}
        </span >
    );
};

export default CodedText;