import { getNotesList } from "../../store/notesSlice";
import { useAppSelector } from "../../store/store";
import DatePoint from "./datePoint";
import { styled } from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const CalendarPanel = () => {
    const actualNotes = useAppSelector(getNotesList());
    return (
        <Wrapper>
            <h1>priv</h1>
            {actualNotes.map((el) => (
                <DatePoint key={el.date + el.time} dateObj={el} />
            ))}
        </Wrapper>
    );
};

export default CalendarPanel;
