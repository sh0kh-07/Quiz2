import { $api } from "../Headers";

class apiTopic {
    static Get = async (data) => {
        const response = await $api.get(
            `/topic/admin/page?moduleId=${data?.id}&page=${data?.page}`
        );
        return response;
    };
    static GetForUser = async (data) => {
        const response = await $api.get(
            `/topic/user/page?moduleId=${data?.id}&page=${data?.page}`, {
            headers: {
                'chat-id': data?.telegramUserId
            }
        }
        );
        return response;
    };
    static ExelDownload = async (id) => {
        const response = await $api.get(
            `/topic/excel/${id}`
        );
        return response;
    };

    static Create = async (data) => {
        const response = await $api.post(
            `/topic`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response;
    };
    static Update = async (id, data) => {
        const response = await $api.put(
            `/topic/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response;
    };
    static Delete = async (id) => {
        const response = await $api.delete(
            `/topic/${id}`
        );
        return response;
    };
}

export { apiTopic };
