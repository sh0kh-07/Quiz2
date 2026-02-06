import { $api } from "../Headers";

class OptionApi {

    static Edit = async (id, data) => {
        const response = await $api.put(`/options/${id}`, data)
        return response;
    }
    static Delete = async (id) => {
        const response = await $api.delete(`/options/${id}`)
        return response;
    }
}

export { OptionApi };