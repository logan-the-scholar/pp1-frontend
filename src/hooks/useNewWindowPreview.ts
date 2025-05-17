import { useRef } from "react";

export default function useNewWindowPreview() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const open = () => {
    const newWindow = window.open("", "", "width=800,height=600");
    if (!newWindow) return;

    const container = document.createElement("div");
    newWindow.document.body.appendChild(container);
    containerRef.current = container;
  };

  return { containerRef, open };
}