import React from "react";

export default function Title({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
    return (
        <h2 {...props} className={`mb-4 pt-0 text-2xl font-semibold text-gray-800 dark:text-gray-200 ${props.className ?? ""}`}>
            {children}
        </h2>
    )
}