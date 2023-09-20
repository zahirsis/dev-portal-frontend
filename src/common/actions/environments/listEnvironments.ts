import axiosInstance, {Response} from "@/common/config/axios";
import {ResourceValues} from "@/common/types";

interface Environment {
    code: string;
    label: string;
    accent_color: string;
    default_active: boolean;
    default_replicas: ResourceValues;
    concurrences: string[];
}

export default async function listEnvironments(): Promise<Environment[]> {
    const res = await axiosInstance.get<Response<Environment[]>>('/environments');
    return res.data.data;
}