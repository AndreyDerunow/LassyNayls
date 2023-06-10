import { RootState } from "./store";
import { Dispatch, createAction, createSlice } from "@reduxjs/toolkit";
import sheetService, { Client } from "../services/sheet.service";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface ClientNote {
    value: string;
    date: Date;
    time: string;
    x: number;
    y: number;
}

interface ClientState {
    entities: Array<ClientNote>;
    values: Array<string>;
    isLoading: boolean;
    dataLoaded: boolean;
    error: string;
}

const initialState: ClientState = {
    entities: [],
    values: [],
    isLoading: false,
    dataLoaded: false,
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
            const values = action.payload.map((el) => el.value);
            state.values = values;
        },
        notesDataRequested: (state) => {
            state.isLoading = true;
        },
        notesDataRequestFailed: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.dataLoaded = false;
            state.error = action.payload;
        }
    }
});

const { reducer: notesReducer, actions } = clientsSlice;

const {
    clientNoteAdded,
    notesDataRecieved,
    notesDataRequestFailed,
    notesDataRequested
} = actions;

const clientNoteAddRequested = createAction("clients/clientNoteAddRequested");

//Todo: убрать эни
export const addClientNote = (data: Client) => async (dispatch: Dispatch) => {
    dispatch(clientNoteAddRequested());
    try {
        const content: any = await sheetService.addNote(data);
        // dispatch(clientNoteAdded(content));
        return content;
    } catch (e) {
        console.log(e);
    }
};

export const loadNotesList = () => async (dispatch: Dispatch) => {
    dispatch(notesDataRequested());
    try {
        const { data } = await sheetService.getData();
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
export default notesReducer;
