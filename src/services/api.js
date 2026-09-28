import axios from "axios";
import counterpart from "counterpart";
import { ROUTES } from "../constants/routes";

// Handle CJS/ESM interop in Jest with Axios 1.x
const getAxiosInstance = () => {
    if (typeof axios.create === "function") {
        return axios.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || "",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (axios.default && typeof axios.default.create === "function") {
        return axios.default.create({
            baseURL: process.env.REACT_APP_API_BASE_URL || "",
            timeout: 0,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    return axios;
};

const api = getAxiosInstance();

if (api.interceptors) {
    // Dynamically attach Accept-Language header based on active locale
    api.interceptors.request.use(
        (config) => {
            config.headers = config.headers || {};
            config.headers["Accept-Language"] = counterpart.getLocale();
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response.data,
        (error) => {
            // Catch unexpected technical errors: 500+ or network error
            if (!error.response || error.response.status >= 500) {
                window.location.href = ROUTES.ERROR;
            }
            return Promise.reject(error);
        }
    );
}

export default api;