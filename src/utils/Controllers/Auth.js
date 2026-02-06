import api from "../axios";

class Auth {
    static Login = async (data) => {
        const response = await api.post(`/auth/login`, data)
        return response;
    }
}

export { Auth };