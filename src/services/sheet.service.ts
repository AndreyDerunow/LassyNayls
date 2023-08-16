import { format } from "date-fns";
import {
    Client,
    ClientDate,
    CoordsCellsData,
    TimeCellsData
} from "../interfaces/interfaces";
import httpService from "./http.service";

const sheetService = {
    addNote: async (payload: Client) => {
        const qwery = new FormData();
        const formatedDate = payload.date && format(payload.date, "dd/MM/yyyy");
        const formatedTime = payload.time && format(payload.time, "HH:mm");
        console.log("formatedDate", formatedDate);
        console.log("formatedTime", formatedTime);
        qwery.append(
            "note",
            JSON.stringify({
                ...payload,
                date: formatedDate,
                time: formatedTime
            })
        );
        const content = await httpService.post("", qwery);
        return content;
    },
    getData: async (dataJson: string) => {
        const content = await httpService.get("", { params: { dataJson } });
        return content;
    },
    getTimesByDate: async (date: ClientDate) => {
        const times = await httpService.get("", { params: { ...date } });
        return times;
    },
    checkIsCellAvailable: async (data: TimeCellsData) => {
        const response = await httpService.get("", { params: { ...data } });
        const isAvailable = response.data.flat()[0] === "";
        return isAvailable;
    },
    addPluse: async (payload: TimeCellsData) => {
        const data = new FormData();
        const { x, y, cells } = payload;
        if (x && y && cells) {
            data.append("x", x + "");
            data.append("y", y + "");
            data.append("cells", JSON.stringify(cells));
        }
        const response = await httpService.post("", data);
        return response;
    },
    clearPluses: async (payload: CoordsCellsData[]) => {
        const data = new FormData();
        data.append("clearArray", JSON.stringify(payload)); // отправили массив объектов в джсоне
        const response = await httpService.post("", data);
        return response;
    }
};

export default sheetService;
