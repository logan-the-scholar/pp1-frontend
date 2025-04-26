import localFont from 'next/font/local';

export const jetBrainsMono = localFont({
    src: [
        {
            path: '../../public/fonts/JetBrainsMono-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/JetBrainsMono-Bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: "../../public/fonts/JetBrainsMono-Italic.ttf",
            weight: "400",
            style: "italic"
        },
        {
            path: "../../public/fonts/JetBrainsMono-ExtraBoldItalic.ttf",
            weight: "800",
            style: "italic"
        },
        {
            path: "../../public/fonts/JetBrainsMono-ExtraLight.ttf",
            weight: "300",
            style: "normal",
        }
    ],
    variable: '--font-myfont',
});