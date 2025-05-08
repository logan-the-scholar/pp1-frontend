export default function LanguageMapper(language: string): string {
    switch (language.toLowerCase()) {
        case "js":
            return "javascript";
        case "css":
            return "css";
        case "html":
            return "html";
        case "ts":
            return "typescript";
        case "md":
            return "markdown";
        default:
            return "text";
    }
}