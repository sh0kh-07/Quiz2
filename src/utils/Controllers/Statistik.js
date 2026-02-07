import { $api } from "../Headers";

class Statistik {
    static Get = async (year) => {
        const response = await $api.get(`/statistic?year=${year}`,)
        return response;
    }
}

export { Statistik };