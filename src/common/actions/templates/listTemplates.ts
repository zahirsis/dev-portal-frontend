import axiosInstance, {Response} from "@/common/config/axios";
import {DataValue, LabelValue, ResourceValues} from "@/common/types";

interface ApplicationObject {
    rootPath: DataValue;
    healthCheckPath: DataValue;
    memory: ResourceValues;
    cpu: ResourceValues;
    port: number;
}

interface IngressObject {
    host: DataValue;
    path: DataValue;
    authentication: boolean;
}

export interface Template {
    code: string;
    label: string;
    applicationDefaults: ApplicationObject;
    ingressDefaults: IngressObject;
    manifests: LabelValue[];
}

export default async function listTemplates(): Promise<Template[]> {
    const res = await axiosInstance.get<Response<Template[]>>('/templates');
    return res.data.data;
}