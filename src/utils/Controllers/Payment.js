import { $api } from "../Headers";

class apiPayment {
    static GetPayment = async (data) => {
        const response = await $api.get(`/payments/page?status=${data?.status}&method=${data?.method}&page=${data?.page}`,)
        return response;
    }
    static EditPayment = async (id, data) => {
        const response = await $api.put(`/payments/${id}`,data)
        return response;
    }
}

export { apiPayment };