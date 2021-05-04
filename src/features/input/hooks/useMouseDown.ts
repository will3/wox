import { useCallback, useEffect } from "react";

export function useMouseDown(button: 0 | 1, callback: () => void) {
    const handleEvent = useCallback((e: MouseEvent) => {
        if (e.button === button) {
            callback();
        }
    }, [callback]);

    useEffect(() => {
        window.addEventListener("mousedown", handleEvent);
        return () => window.removeEventListener("mousedown", handleEvent);
    }, [handleEvent]);
}
