import Link from "next/link";
import React from "react";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    items?: Array<{
        name: string;
        href: string;
        current: boolean;
    }>;
}

export default function Breadcrumb({items, ...props}: BreadcrumbProps) {
    const homeIcon = (
        <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
             fill="currentColor" viewBox="0 0 20 20">
            <path
                d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
        </svg>
    )
    return (
        <nav className="flex mb-4" aria-label="Breadcrumb" {...props}>
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    {items && items.length > 0 ?
                        <Link href="/"
                              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            {homeIcon}
                            Home
                        </Link>
                        :
                        <span
                            className="inline-flex items-center text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                            {homeIcon}
                            Home
                        </span>
                    }
                </li>
                {items?.map((item, index) => {
                    const liProps: { "aria-current"?: "page" } = item.current ? {"aria-current": "page"} : {};
                    return (
                        <li key={index} {...liProps}>
                            <div className="flex items-center">
                                <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                {item.current ? (
                                    <span
                                        className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">{item.name}</span>
                                ) : (
                                    <Link href={item.href}
                                          className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">{item.name}</Link>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>
        </nav>

    )
}