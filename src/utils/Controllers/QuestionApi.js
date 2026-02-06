import api from "../axios";
import { $api } from "../Headers";

class QuestionApi {
    static Create = async (data) => {
        const response = await $api.post(`/questions`, data)
        return response;
    }
    static Get = async (id, page) => {
        const response = await $api.get(`/questions/page?quizId=${id}&page=${page}`)
        return response;
    }
    static GetAll = async (id) => {
        const response = await api.get(`/questions/all?quizId=${id}`)
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/questions/${id}`, data)
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/questions/${id}`)
        return response;
    }
}

export { QuestionApi };