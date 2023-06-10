import httpService from "./http.service";

export interface Client {
    date?: string;
    name?: string;
}

const sheetService = {
    addNote: async (payload: Client) => {
        const qwery = new FormData();
        const { date, name } = payload;
        if (date && name) {
            qwery.append("note", `${name} записалась на ${date} на 10 утра`);
        }
        const content = await httpService.post("", qwery);
        return content;
    },
    getData: async () => {
        const content = await httpService.get("");
        return content;
    }
};

export default sheetService;
