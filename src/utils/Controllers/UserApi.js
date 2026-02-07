import api from "../axios";
class UserApi {
    static Create = async (data) => {
        const response = await api.post(`/user/user`, data)
        return response;
    }
}

export { UserApi };