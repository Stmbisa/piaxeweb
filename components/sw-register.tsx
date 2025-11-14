"use client";

import { useEffect } from "react";

export default function SWRegister() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // register our prebuilt service worker in public/sw.js
            navigator.serviceWorker
                .register("/sw.js")
                .catch(() => {
                    /* noop */
                });
        }
    }, []);
    return null;
}
