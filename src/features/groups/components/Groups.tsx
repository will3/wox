import { observer } from "mobx-react-lite";
import React from "react";
import { useGroundStore } from "StoreProvider";
import _ from "lodash";
import { Group } from "./Group";

export const Groups = observer(() => {
    const groundStore = useGroundStore();
    const grounds = groundStore.grounds;

    return (
        <>
            {
                _.values(grounds).map(ground => <Group ground={ground} />)
            }
        </>
    );
});
