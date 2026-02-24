import { $api } from "../Headers";

class apiParts {
    static GetParts = async (data) => {
        const response = await $api.get(`/parts/admin/page?topicId=${data?.topicId}&page=${data?.page}`)
        return response;
    }
    static GetPartsForUser = async (data) => {
        const response = await $api.get(`/parts/user/page?topicId=${data?.id}&page=${data?.page}`, {
            headers: {
                'chat-id': data?.telegramUserId
            }
        })
        return response;
    }

    static EditParts = async (id, data) => {
        const response = await $api.put(`/parts/${id}`, data)
        return response;
    }
    static DeleteParts = async (id) => {
        const response = await $api.delete(`/parts/${id}`)
        return response;
    }
    static ExelDownloadParts = async (id) => {
        const response = await $api.get(
            `/parts/excel/${id}`
        );
        return response;
    };
    static CreateParts = async (data) => {
        const response = await $api.post(`/parts`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response;
    }
}

export { apiParts };