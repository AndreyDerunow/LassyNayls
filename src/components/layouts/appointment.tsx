import AppointmentForm from "../ui/appointmentForm";
import { styled } from "styled-components";

const Wrapper = styled.div`
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;
const Appointment = () => {
    return (
        <Wrapper>
            <AppointmentForm />
        </Wrapper>
    );
};

export default Appointment;
