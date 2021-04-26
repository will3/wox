import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useChunksStore } from "StoreProvider";

export const Remesh = observer(() => {
    const chunksStore = useChunksStore();
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === "Space") {
            console.log("Remeshing...");
            chunksStore.remeshAll();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return null;
});