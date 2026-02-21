import { $api } from "../Headers";

class Notification {

    static Create = async (data) => {
        const response = await $api.post(`/notifications`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response;
    }

    static GetAll = async (page) => {
        const response = await $api.get(`/notifications/page?page=${page}`)
        return response;
    }
    static Send = async (data) => {
        const response = await $api.post(`/notifications/send`, data)
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/notifications/${id}`)
        return response;
    }
    static Edit = async (id, data) => {
        const response = await $api.put(`/notifications/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response;
    }
}

export { Notification };