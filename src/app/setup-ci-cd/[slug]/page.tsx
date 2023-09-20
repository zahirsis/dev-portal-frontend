'use client';

import Breadcrumb from "@/components/reusable/Breadcrumb"
import Title from "@/components/reusable/Title"
import {useState} from "react";
import {useRouter} from "next/navigation";
import useWebSocket from 'react-use-websocket';
import LogView from "@/components/reusable/LogView";

type Message = {
    time: Date;
    step: string;
    message: string;
    type: "progress" | "success" | "error"
    node: boolean
}

type WsMessage = {
    time: string;
    step: string;
    message: string;
    type: "progress" | "success" | "error"
    node: boolean
}

export default function SetupCiCdProgress({params}: { params: { slug: string } }) {
    const router = useRouter()

    const [messages, setMessages] = useState<Message[]>([])
    const [closed, setClosed] = useState(false)

    const ws_url = `http://localhost:8080/api/ci-cd/progress/ws?id=${params.slug}`;

    useWebSocket(ws_url, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: (message) => {
            const wsMessage: WsMessage = JSON.parse(message.data);
            const formattedMessage = {
                ...wsMessage,
                time: new Date(wsMessage.time),
            }
            setMessages(messages => [...messages, formattedMessage]);
        },
        onClose: () => {
            console.log('WebSocket connection closed.');
            setClosed(true);
        },
    }, !closed);

    return (
        <div className="p-4 pb-0 flex flex-1 flex-col">
            <Breadcrumb items={[
                {name: "Setup CI/CD", href: "/setup-ci-cd", current: false},
                {name: "Progress", href: `/setup-ci-cd/${params.slug}`, current: true},
            ]}/>
            <div className="flex flex-row justify-between items-center mb-4">
                <Title className="mb-0">Setup CI/CD - Progress</Title>
                <button type="button" onClick={() => router.push("/setup-ci-cd")}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center
                          dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    New Setup
                </button>
            </div>
            <div className="gab-4 flex-1 flex flex-col">
                <LogView items={messages} closed={closed}/>
            </div>
        </div>
    )
}
