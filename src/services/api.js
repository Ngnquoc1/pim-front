import axios from "axios";

const api = axios.create({
    baseURL: "",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // Bắt các lỗi kỹ thuật không mong muốn: 500, 502, 503, 504 hoặc lỗi mất kết nối mạng (Network Error)
        if (!error.response || error.response.status >= 500) {
            window.location.href = "/error";
        }
        return Promise.reject(error);
    }
);

export default api;