import api from "./api";

const groupService = {
    getAllGroups: async () => {
        return await api.get("/groups");
    },
}

export default groupService;