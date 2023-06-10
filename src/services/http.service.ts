import axios from "axios";

const url =
    "https://script.google.com/macros/s/AKfycbzMPZztuw5QvKMIduwlckpOqAlbbbcX2Xd_TAasp2iv-b2xg5CKWjGwYDOmi9McmAFARg/exec";

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
