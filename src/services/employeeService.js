import api from "./api";
const employeeService = {
    // GET /employees/search?term=...
    searchEmployees: (term, signal) => {
        return api.get('/employees/search', {
            params: { term },
            signal,
        });
    },
};

export default employeeService;