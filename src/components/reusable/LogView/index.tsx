import React, {useState} from "react";
import LoadingIndicator from "@/components/reusable/LoadIndicator";

interface LogViewProps extends React.HTMLAttributes<HTMLElement> {
    items: Array<{
        time: Date;
        step: string;
        message: string;
        type: "progress" | "success" | "error"
        node: boolean
    }>;
    closed: boolean
}

export default function LogView({items, ...props}: LogViewProps) {

    const [expandedSteps, setExpandedSteps] = useState<{ [step: string]: boolean }>({});
    const [showTimestamp, setShowTimestamp] = useState<boolean>(false);

    const getStatus = (step: string): "progress" | "success" | "error" => {
        const lastStep = items.filter(log => log.step === step).pop();
        return lastStep?.type ?? "progress";
    }

    const getClasses = (status: "progress" | "success" | "error"): string => {
        switch (status) {
            case "progress":
                return "text-gray-300";
            case "success":
                return "text-green-500";
            case "error":
                return "text-red-500";
        }
    }

    const getIcon = (status: "progress" | "success" | "error"): string => {
        switch (status) {
            case "progress":
                return "▶";
            case "success":
                return "✓";
            case "error":
                return "✗";
        }
    }

    const getLastStep = (step: string): boolean => {
        return [...items].pop()?.step === step;
    }

    const openByDefault = (step: string, status: string): boolean => {
        if (expandedSteps[step] === undefined) {
            return status === "progress" || getLastStep(step);
        }
        return expandedSteps[step];
    }

    // Função para alternar a expansão/collapse de um step
    const toggleStepExpansion = (step: string) => {
        setExpandedSteps((prevState) => ({
            ...prevState,
            [step]: !prevState[step],
        }));
    };

    return (
        <div className="bg-gray-900 flex-1 flex flex-col text-white p-4 rounded-lg shadow-md" {...props}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-2 justify-start">
                    <h2 className="text-xl font-semibold">Process logs</h2>
                    <div className="flex items-center space-x-2 ml-0">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={showTimestamp}
                                   onChange={() => setShowTimestamp(!showTimestamp)} className="sr-only peer"/>
                            <div
                                className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span
                                className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Show timestamp</span>
                        </label>
                    </div>
                </div>
                {/*TODO: implement stop function*/}
                {/*<button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded focus:outline-none">*/}
                {/*    Parar*/}
                {/*</button>*/}
            </div>
            <div className="bg-gray-800 p-4 rounded-lg overflow-y-auto min-h-80 flex-1">
                {items.filter(log => log.node).map((log, index) => {
                    const status = getStatus(log.step);
                    const icon = getIcon(status);
                    const classes = getClasses(status);
                    const opened = openByDefault(log.step, status);
                    const children = items.filter((childLog) =>
                        !childLog.node && childLog.step === log.step)
                    return (
                        <div key={index} className="mb-2">
                            <div className="flex items-center">
                                {children.length > 0 && <button
                                    className="text-blue-500 hover:underline focus:outline-none mr-2"
                                    onClick={() => toggleStepExpansion(log.step)}
                                >
                                    {opened ? '▼' : '▶'}
                                </button>}
                                <pre className={`text-sm whitespace-pre-wrap cursor-pointer ${classes}`}
                                     onClick={() => toggleStepExpansion(log.step)}>
                                    <span className="mr-2">{icon}</span>
                                    {showTimestamp ? `${
                                            log.time.toLocaleDateString()} ${log.time.toLocaleTimeString()} | `
                                        : ''}
                                    {log.message}
                            </pre>
                            </div>
                            {log.node && opened && children.length > 0 && (
                                <div className="ml-10 p-1">
                                    {children.map((childLog, childIndex) => (
                                            <div key={childIndex} className="mb-2">
                                                <pre
                                                    className={`text-sm whitespace-pre-wrap ${getClasses(childLog.type)}`}>
                                                    {showTimestamp ?
                                                        `${childLog.time.toLocaleDateString()} ${childLog.time.toLocaleTimeString()} | `
                                                        : ''}
                                                    {childLog.message}
                                                </pre>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    )
                })}
                <div className="flex items-start">
                    <LoadingIndicator isOpened={!props.closed} className="m-4 text-lg"/>
                </div>
            </div>
        </div>
    );
};
