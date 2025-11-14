"use client";

import React from "react";
import dynamic from "next/dynamic";

const EscrowSimulation = dynamic(() => import("./escrow-simulation").then((m) => m.EscrowSimulation), {
    ssr: false,
});

export default function EscrowSimWrapper() {
    return <EscrowSimulation />;
}
