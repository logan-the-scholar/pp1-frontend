import FileType from "@/types/enum/FileType";

export default function LanguageMapper(language: string): string {
    switch (language.toLowerCase()) {
        case FileType.JAVASCRIPT:
            return "javascript";
        case FileType.CSS:
            return "css";
        case FileType.HTML:
            return "html";
        case FileType.TYPESCRIPT:
            return "typescript";
        case FileType.MARKDOWN:
            return "markdown";
        case FileType.TSX:
            return "typescriptreact";
        case FileType.JSX:
            return "javascriptreact";
        default:
            return "text";
    }
}