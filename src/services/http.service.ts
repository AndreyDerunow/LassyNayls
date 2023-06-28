import axios from "axios";

const url = `${import.meta.env.VITE_SHEETS_URL}`;

const http = axios.create({
    baseURL: url
});

const httpService = {
    get: http.get,
    post: http.post,
    delete: http.delete,
    put: http.put
};

export default httpService;
