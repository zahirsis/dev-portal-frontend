import axiosInstance, {Response} from "@/common/config/axios";
import {InputError} from "@/common/errors/inputError";
import {SetupData} from "@/common/actions/ci-cd/setupCiCd";

export interface Data {
    repositoryBaseUrl: string;
}

export default async function getCiCdData(): Promise<Data> {
    const res = await axiosInstance.get<Response<Data>>('/ci-cd/data');
    return res.data.data;
}

