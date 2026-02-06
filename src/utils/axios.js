import axios from "axios";

const api = axios.create({
    baseURL: "https://dev.ithubs.uz/quiz/api/v1/",
});

export default api;
