import React from "react";
import { ClientNote } from "../../store/notesSlice";

interface DatePointProps {
    dateObj: ClientNote;
}
//{value: '', date: 1684699200000, time: '8:00-9:30', x: 1, y: 1}
const DatePoint = ({ dateObj }: DatePointProps) => {
    return (
        <div>
            {dateObj.time +
                " " +
                new Date(dateObj.date)
                    .toLocaleDateString("ru-RU")
                    .split(",")[0]}
        </div>
    );
};

export default DatePoint;
