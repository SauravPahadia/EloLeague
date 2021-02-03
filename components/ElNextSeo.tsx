import {NextSeo} from "next-seo";
import React from "react";

export default function ElNextSeo({title, description}: {title: string, description?: string}) {
    return (
        <NextSeo
            title={title + " | EloLeague"}
            description={description || "EloLeague is the easiest platform for tracking games and player ratings for your league, club, or house."}
        />
    )
}