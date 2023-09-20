import React from "react";

export default function Content({children}: {children: React.ReactNode}) {
    return (
        <div className="p-4 flex flex-col flex-1">
            {children}
        </div>
    )
  }
  