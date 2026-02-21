import { $api } from "../Headers";

class apiTopicModule {
    static Post = async (data) => {
        const response = await $api.post(`/topic-modules`, data)
        return response;
    }
    static GetAll = async (data) => {
        const response = await $api.get(`/topic-modules/admin/page?type=${data?.type}&page=${data?.page}`)
        return response;
    }
    static GetForUser = async (data) => {
        const response = await $api.get(`/topic-modules/user/page?page=${data?.page}`, {
            headers: {
                'chat-id': data?.telegramUserId
            }
        });
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/topic-modules/${id}`)
        return response;
    }
    static Put = async (id, data) => {
        const response = await $api.put(`/topic-modules/${id}`, data)
        return response;
    }
}

export { apiTopicModule };