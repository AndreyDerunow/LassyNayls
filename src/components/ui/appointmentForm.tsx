import { useState } from "react";
import { useAppDispatch } from "../../store/store";
import { addClientNote } from "../../store/notesSlice";

const AppointmentForm = () => {
    const [data, setData] = useState({ date: "", name: "" });
    const dispatch = useAppDispatch();

    const handleChange = ({
        target
    }: React.ChangeEvent<HTMLInputElement>): void => {
        if (target) {
            setData((prev) => ({
                ...prev,
                [target.name]: target.value
            }));
        }
    };
    const handleSubmit = async (): Promise<void> => {
        const message = await dispatch(addClientNote(data));
        console.log(message);
    };

    return (
        <>
            <form>
                <div className="mb-3">
                    <label htmlFor="exampleInput" className="form-label">
                        Дата визита
                    </label>
                    <input
                        onChange={handleChange}
                        type="text"
                        id="exampleInput"
                        className="form-control"
                        name="date"
                        value={data.date}
                    />
                </div>
                <div className="mb-3">
                    <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                    >
                        Имя
                    </label>
                    <input
                        onChange={handleChange}
                        type="text"
                        className="form-control"
                        name="name"
                        value={data.name}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn btn-primary"
                >
                    Записаться
                </button>
            </form>
        </>
    );
};

export default AppointmentForm;
