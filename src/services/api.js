import axios from "axios";

// Handle CJS/ESM interop in Jest with Axios 1.x
const getAxiosInstance = () => {
    if (typeof axios.create === "function") {
        return axios.create({
            baseURL: "",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (axios.default && typeof axios.default.create === "function") {
        return axios.default.create({
            baseURL: "",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return axios;
};

const api = getAxiosInstance();

if (api.interceptors) {
    api.interceptors.response.use(
        (response) => response.data,
        (error) => {
            // Catch unexpected technical errors: 500+ or network error
            if (!error.response || error.response.status >= 500) {
                window.location.href = "/error";
            }
            return Promise.reject(error);
        }
    );
}

export default api;