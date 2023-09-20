import axiosInstance, {Response} from "@/common/config/axios";
import {InputError} from "@/common/errors/inputError";

export interface SetupData {
    template: string;
    envs: {
        code: string;
        replicas: {
            min: number;
            max: number;
        }
    }[];
    manifests: string[];
    squad: string;
    application: {
        name: string;
        rootPath: string;
        healthCheckPath: string;
        resources: {
            cpu: {
                min: number;
                max: number;
            },
            memory: {
                min: number;
                max: number;
            }
        }
        port: number;
    }
    ingress: {
        customHost: string;
        customPath: string;
        authentication: boolean;
    }
}

interface SetupStarted {
    code: string
}

export default async function setupCiCd(data: SetupData): Promise<SetupStarted> {
    try {
        const res = await axiosInstance.post<Response<SetupStarted>>('/ci-cd/setup', data);
        if (res.data.status !== "success"){
            throw new Error(res.data.message ?? "Something went wrong")
        }
        return res.data.data;
    } catch (e: any) {
        if (e.response?.status === 400) {
            throw new InputError(e.response.data.message ?? "", e.response.data.errors)
        }
        throw e;
    }
}

