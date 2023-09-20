import React, {useEffect, useState} from "react";

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLElement> {
    isOpened: boolean;
}

export default function LoadingIndicator({ isOpened, className, ...props }: LoadingIndicatorProps) {
    const [dots, setDots] = useState('.');

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isOpened) {
            interval = setInterval(() => {
                setDots((prevDots) => {
                    if (prevDots === '....') {
                        return '.';
                    } else {
                        return prevDots + '.';
                    }
                });
            }, 500); // Altere o intervalo conforme desejado
        }

        return () => {
            clearInterval(interval);
        };
    }, [isOpened]);

    return isOpened && (
        <div {...props} className="flex items-center justify-center">
            <div className={`text-gray-500 ${className}`}>{dots}</div>
        </div>
    );
};
