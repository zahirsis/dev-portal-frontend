import axiosInstance, {Response} from "@/common/config/axios";

interface Squad {
    code: string;
    label: string;
}

export default async function listSquads(): Promise<Squad[]> {
    const res = await axiosInstance.get<Response<Squad[]>>('/squads');
    return res.data.data;
}