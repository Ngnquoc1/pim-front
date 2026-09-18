import axios from "axios";

const api = axios.create({
    baseURL: "",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (res) => res.data,
    (error) => {
        return Promise.reject(error);
    }
)

export default api;