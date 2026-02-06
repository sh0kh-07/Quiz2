import { $api } from "../Headers";

class UserAnswer {
    static Create = async (data) => {
        const response = await $api.post(`/user-quizzes`, data)
        return response;
    }
}

export { UserAnswer };