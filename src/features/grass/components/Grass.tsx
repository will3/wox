import { observer } from "mobx-react-lite";
import React from "react";
import { useGroundStore } from "StoreProvider";
import { GrassChunk } from "./GrassChunk";

export const Grass = observer(() => {
    const groundStore = useGroundStore();
    const grounds = groundStore.grounds;
    return <>{Object.values(grounds).map(ground => <GrassChunk key={ground.key} ground={ground} />)}</>
});
