import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
    loadNotesList,
    getNotesError,
    getNotesLoadingStatus
} from "../../store/notesSlice";

const CalendarLoader = ({ children }: React.PropsWithChildren) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(loadNotesList());
    }, []);
    const isDataLoading = useAppSelector(getNotesLoadingStatus());
    const error = useAppSelector(getNotesError());
    if (isDataLoading) return <h1>Loading...</h1>;
    if (error) return <h1>{error}</h1>;
    return <>{children}</>;
};

export default CalendarLoader;
