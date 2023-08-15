import { RootState } from "./store";
import { Dispatch, createAction, createSlice } from "@reduxjs/toolkit";
import sheetService from "../services/sheet.service";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
    Client,
    ClientDate,
    ClientNote,
    ClientState,
    TimeData
} from "../interfaces/interfaces";

const initialState: ClientState = {
    entities: [],
    times: [],
    isLoading: false,
    dataLoaded: false,
    isTimeLoading: false,
    timeDataLoaded: false,
    error: ""
};

const clientsSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        clientNoteAdded: (state, action: PayloadAction<ClientNote>) => {
            state.entities.push(action.payload);
        },
        notesDataRecieved: (state, action: PayloadAction<ClientNote[]>) => {
            state.entities = action.payload;
            state.isLoading = false;
            state.dataLoaded = true;
            state.error = "";
        },
        notesDataRequested: (state) => {
            state.entities = [];
            state.times = [];
            state.isLoading = true;
        },
        notesDataRequestFailed: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.dataLoaded = false;
            state.error = action.payload;
        },
        clientTimesByDateRequested: (state) => {
            state.times = [];
            state.isTimeLoading = true;
            state.timeDataLoaded = false;
        },
        clientTimesByDateRecieved: (
            state,
            action: PayloadAction<Array<TimeData>>
        ) => {
            state.isTimeLoading = false;
            state.times = action.payload;
            state.timeDataLoaded = true;
            state.error = "";
        }
    }
});

const { reducer: notesReducer, actions } = clientsSlice;

const {
    clientTimesByDateRequested,
    clientTimesByDateRecieved,
    clientNoteAdded,
    notesDataRecieved,
    notesDataRequestFailed,
    notesDataRequested
} = actions;

const clientNoteAddRequested = createAction("clients/clientNoteAddRequested");

export const addClientNote =
    (noteData: Client) => async (dispatch: Dispatch) => {
        dispatch(clientNoteAddRequested());
        try {
            const { data } = await sheetService.addNote(noteData);
            // dispatch(clientNoteAdded(content));
            return data;
        } catch (e) {
            console.log(e);
        }
    };

export const getTimesByDate =
    (dataObj: ClientDate) => async (dispatch: Dispatch) => {
        dispatch(clientTimesByDateRequested());
        try {
            const { data } = await sheetService.getTimesByDate(dataObj);
            const times = data.map((el: TimeData) => ({
                ...el,
                timeString: el.timeString.split("-")[0]
            }));
            dispatch(clientTimesByDateRecieved(times));
            return times;
        } catch (e) {
            console.log(e);
        }
    };

export const loadNotesList =
    (dataJson: string) => async (dispatch: Dispatch) => {
        dispatch(notesDataRequested());
        try {
            const { data } = await sheetService.getData(dataJson);
            dispatch(notesDataRecieved(data));
            return data;
        } catch (e) {
            if (e instanceof Error) {
                notesDataRequestFailed(e.message);
            }
        }
    };
export const getNotesList = () => (state: RootState) => state.notes.entities;
export const getNotesLoadingStatus = () => (state: RootState) =>
    state.notes.isLoading;
export const getNotesLoaded = () => (state: RootState) => state.notes.isLoading;
export const getNotesError = () => (state: RootState) => state.notes.error;
export const getTimesArr = () => (state: RootState) => state.notes.times;
export default notesReducer;
