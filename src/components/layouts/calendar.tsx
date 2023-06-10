import CalendarLoader from "../hocs/calendarLoader";
import CalendarPanel from "../ui/calendarPanel";

const Calendar = () => {
    return (
        <>
            <CalendarLoader>
                <CalendarPanel />
            </CalendarLoader>
        </>
    );
};

export default Calendar;
