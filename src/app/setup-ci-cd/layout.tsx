'use client';

import React from "react";
import {Provider} from "react-redux";
import store from "@/common/store/store";

export default function SetupCiCdProgressLayout({children,}: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}