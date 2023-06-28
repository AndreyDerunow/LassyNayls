import AppointmentForm from "./components/ui/appointmentForm";
import { Route, Switch } from "react-router-dom";
import Calendar from "./components/layouts/calendar";

function App() {
    return (
        <Switch>
            <Route path="/calendar" component={Calendar} />
            <Route path="/" exact component={AppointmentForm} />
        </Switch>
    );
}

export default App;
