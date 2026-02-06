import { $api } from "../Headers";

class Groups {
    static Send = async (data) => {
        const response = await $api.post(`/groups/send-quiz`, data)
        return response;
    }
    static Get = async () => {
        const response = await $api.get(`/groups`)
        return response;
    }
}

export { Groups };