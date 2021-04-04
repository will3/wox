import { Grids } from "features/grid/components/Grids";
import { Structures } from "features/structures/components/Structures";
import { Trees } from "features/trees/components/Trees";
import { Water } from "features/water/components/Water";
import { Waterfalls } from "features/waterfalls/components/Waterfalls";
import React from "react";
import { Ground } from "../ground/components/Ground";

export function Planet() {
    return (
        <>
            <Ground />
            <Grids highlightGrid={true} />
            <Structures placeStructures={true} />
            <Waterfalls />
            <Trees />
            <Water />
        </>
    );
}