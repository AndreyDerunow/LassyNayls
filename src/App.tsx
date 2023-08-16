import { Route, Switch } from "react-router-dom";
import Calendar from "./components/layouts/calendar";
import { styled } from "styled-components";
import Appointment from "./components/layouts/appointment";

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function App() {
    return (
        <Wrapper>
            <Switch>
                <Route path="/calendar" component={Calendar} />
                <Route path="/" exact component={Appointment} />
            </Switch>
        </Wrapper>
    );
}

export default App;
