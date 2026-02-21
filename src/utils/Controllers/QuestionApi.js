import api from "../axios";
import { $api } from "../Headers";

class QuestionApi {
    static Create = async (data) => {
        const response = await $api.post(`/questions`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response;
    }
    static Get = async (id, page) => {
        const response = await $api.get(`/questions/page?topicId=${id}&page=${page}`)
        return response;
    }
    static GetForUser = async (id, telegramUserId) => {
        const response = await $api.get(`/questions/all?topicId=${id}`, {
            headers: {
                'chat-id': telegramUserId
            }
        })
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/questions/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/questions/${id}`)
        return response;
    }
    static PostResult = async (id) => {
        const response = await $api.delete(`/questions/${id}`)
        return response;
    }
}

export { QuestionApi };