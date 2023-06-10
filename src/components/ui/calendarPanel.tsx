import { useForm } from "react-hook-form";
import { getNotesList } from "../../store/notesSlice";
import { useAppSelector } from "../../store/store";
import DatePoint from "./datePoint";

interface CalendarForm {
    date: Date;
    time: string;
    name: string;
    service: string;
    telephone: string;
}

const CalendarPanel = () => {
    const actualNotes = useAppSelector(getNotesList());
    const {} = useForm<CalendarForm>({});
    return (
        <>
            <h1>priv</h1>
            {actualNotes.map((el) => (
                <DatePoint key={el.date + el.time} dateObj={el} />
            ))}
        </>
    );
};

export default CalendarPanel;
