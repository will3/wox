import keycode from "keycode";
import { useCallback, useEffect } from "react";
import { Key, keymap } from "../keymap";

export function useKeyUp(key: Key, callback: () => void) {
    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        const k = keycode(e);
        if (keymap[key].includes(k)) {
            callback();
        }
    }, [callback]);

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        return () => window.removeEventListener("keyup", handleKeyUp);
    }, [handleKeyUp]);
}
