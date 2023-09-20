import axios from "axios";

export interface Response<T> {
    data: T;
    status: "success" | "error";
    message?: string;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default axiosInstance;