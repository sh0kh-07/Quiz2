import { $api } from "../Headers";

class UserAnswer {
    static Create = async (data , ) => {
        const response = await $api.post(`/user-topics`, data)
        return response;
    }
}

export { UserAnswer };