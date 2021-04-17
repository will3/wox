import { GroundData } from "features/ground/store";
import { useEffect } from "react";
import { useGroupStore } from "StoreProvider";

interface GroupProps {
    ground: GroundData;
}

export const Group = ({ ground }: GroupProps) => {
    const groupStore = useGroupStore();
    useEffect(() => {
        groupStore.calcGroups(ground.origin);
    }, [ground.version, ground.origin]);
    return null;
};