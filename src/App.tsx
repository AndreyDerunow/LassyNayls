import AppointmentForm from "./components/ui/appointmentForm";

import { Route, Switch } from "react-router";
import Calendar from "./components/layouts/calendar";

function App() {
    return (
        <div>
            <Switch>
                <Route path="/calendar" component={Calendar} />
                <Route path="/" exact component={AppointmentForm} />
            </Switch>
        </div>
    );
}

export default App;
