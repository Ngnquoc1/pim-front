import api from "./api";
const employeeService = {
    // GET /employees
    getAllEmployees: () => {
        return api.get('/employees');
    },
};

export default employeeService;