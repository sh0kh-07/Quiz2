import { $api } from "../Headers";

class QuizApi {
    static Create = async (data) => {
        const response = await $api.post(`/quizzes`, data)
        return response;
    }
    static Get = async (page) => {
        const response = await $api.get(`/quizzes/page?page=${page}`)
        return response;
    }
    static GetById = async (id) => {
        const response = await $api.get(`/quizzes/${id}`)
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/quizzes/${id}`)
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/quizzes/${id}`, data)
        return response;
    }
}

export { QuizApi };