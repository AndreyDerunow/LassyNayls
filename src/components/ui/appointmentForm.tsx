import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
    addClientNote,
    getNotesList,
    getTimesArr,
    getTimesByDate,
    loadNotesList
} from "../../store/notesSlice";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { styled } from "styled-components";
import ru from "date-fns/locale/ru";
import { getDate, getHours, getMinutes } from "date-fns";
import Select, { OnChangeValue } from "react-select";
import sheetService from "../../services/sheet.service";
import {
    AppointmentData,
    Client,
    CoordsCellsData,
    Option
} from "../../interfaces/interfaces";
import {
    AppointForm,
    AppointmentWrapper,
    InputWrapper
} from "../styled/styledComponents";
registerLocale("ru", ru);

const AppointmentInput = styled.input`
    cursor: pointer;
    text-align: center;
    font-family: cursive;
    font-size: 14px;
    height: 28.6px;
    width: 97.5%;
    border-radius: 4px;
    display: block;
    border: 1px solid lightgray;
    transition: all 0.3s ease;
    &: hover {
        border: 1px solid hsl(0, 0%, 70%);
    }
`;
const AppointmentLabel = styled.label`
    text-align: center;
    font-family: cursive;
    display: block;
    width: 100%;
`;
const AppointmentErrorMessage = styled.p`
    width: 200px;
    font-size: 10px;
    text-align: center;
    font-family: cursive;
    color: palevioletred;
    text-decoration: underline palevioletred;
`;
const AppointmentButtonMessage = styled.p`
    width: 200px;
    margin: 0;
    font-size: 10px;
    text-align: center;
    font-family: cursive;
    color: #3910e6;
    text-decoration: underline #3910e6;
`;
const Button = styled.button`
    transition: all 0.5s ease;
    text-align: center;
    padding: 10px 0;
    font-family: cursive;
    margin-top: 5px;
    border-radius: 4px;
    border: none;
    width: 80%;
    height: 36px;
    background: linear-gradient(blue, blueviolet 93.66%);
    color: whitesmoke;
    cursor: pointer;
    &: hover {
        background: linear-gradient(skyblue, blue 93.66%);
    }
    &:active {
        background: linear-gradient(lightblue, blueviolet 93.66%);
    }
    &:disabled {
        background: linear-gradient(gray, black 53.66%);
        opacity: 0.5;
    }
`;

const options = [
    { value: "1", label: "Маникюр" },
    { value: "2", label: "Педикюр" },
    { value: "3", label: "Маникюр+Педикюр" }
];

const initialState: Client = {
    date: null,
    time: null,
    phone: "",
    name: "",
    service: null,
    coords: []
};

const AppointmentForm = () => {
    const [data, setData] = useState(initialState);
    const [errors, setErros] = useState("");
    const dispatch = useAppDispatch();
    const notes = useAppSelector(getNotesList());
    const times = useAppSelector(getTimesArr());
    const notesPluses: CoordsCellsData[] = []; // для записей
    const notesPlusesRef = useRef(notesPluses);
    const includeDates: Date[] = []; // для дат
    const includeDatesRef = useRef(includeDates);
    const handleChange = (data: AppointmentData): void => {
        setData((prev) => ({
            ...prev,
            [data.name]:
                data.name === "service"
                    ? JSON.parse(data.value.toString())
                    : data.value
        }));
        if (data.name === "service") {
            getDates(data.value.toString());
        }
        if (data.name === "date") {
            getTimes(data);
        }
        if (data.name === "time") {
            if (typeof data.value !== "string") {
                makePluses(data.value);
            }
        }
    };
    const makePluses = async (dataDate: Date) => {
        console.log("makePluses called");
        const mins = getMinutes(dataDate) === 0 ? "00" : getMinutes(dataDate);
        const hours = getHours(dataDate);
        const dataTimeString = hours + ":" + mins;
        const timeData = times.find((el) => el.timeString === dataTimeString);
        if (timeData && data.service && typeof data.service === "object") {
            await removePluses();
            const isAvailable = await sheetService.checkIsCellAvailable({
                ...timeData,
                cells: data.service
            });
            if (isAvailable) {
                try {
                    const { data: dataObj } = await sheetService.addPluse({
                        ...timeData,
                        cells: data.service
                    });
                    if (dataObj !== "Error: клетка не была занята!") {
                        console.log("+ установлен");
                        setData((prev) => ({
                            ...prev,
                            coords: [dataObj]
                        }));
                        notesPlusesRef.current.length = 0;
                        notesPlusesRef.current.push({
                            ...dataObj,
                            cells: data.service
                        });
                    } else {
                        setErros(() => dataObj);
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                setErros(() => "К сожалению, данное место уже заняли");
            }
        }
    };
    const removePluses = async () => {
        console.log("removePluses called");
        if (notesPlusesRef.current.length > 0) {
            try {
                const { data: dateObj } = await sheetService.clearPluses(
                    notesPlusesRef.current
                );
                console.log(dateObj);
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        if (notes.length > 0) {
            new Set(notes.map((el) => new Date(el.date))).forEach((el) =>
                includeDatesRef.current.push(el)
            );
        }
    }, [notes.length]);
    const getDates = async (dataJson: string) => {
        setData((prev) => ({ ...prev, date: null }));
        includeDatesRef.current.length = 0;
        console.log("getDates called");
        await removePluses();
        setErros(() => "");
        dispatch(loadNotesList(dataJson));
    };

    const getTimes = (dataObj: AppointmentData) => {
        console.log("getTimes called");
        const dateVal = notes.find(
            (el) =>
                getDate(+el.date) ===
                getDate(Date.parse(dataObj.value.toString()))
        );
        if (dateVal && data.service) {
            const { x, y, date } = dateVal;
            const query = { x, y, date, cells: JSON.stringify(data.service) };
            setErros(() => "");
            dispatch(getTimesByDate(query));
        }
    };
    const handleSubmit = async (): Promise<void> => {
        const message = await dispatch(addClientNote(data));
        console.log(message);
    };
    const getTimesClassname = (time: Date): string => {
        const timeHours = time.getHours();
        const timeMinutes = time.getMinutes();
        const timeString =
            timeHours + ":" + (timeMinutes === 0 ? "00" : timeMinutes);
        return times.some((el) => el.timeString === timeString)
            ? ""
            : "display_none";
    };
    const isDisabled = !(
        data.date &&
        data.time &&
        data.phone &&
        data.name &&
        data.service &&
        data.coords.length > 0
    );
    return (
        <AppointmentWrapper>
            <AppointForm>
                <InputWrapper>
                    <AppointmentLabel htmlFor="name">Имя</AppointmentLabel>
                    <AppointmentInput
                        onChange={({
                            target
                        }: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange({
                                name: target.name,
                                value: target.value
                            })
                        }
                        id="name"
                        placeholder="Как обращаться?"
                        type="text"
                        name="name"
                        value={data.name}
                    />
                </InputWrapper>
                <InputWrapper>
                    <AppointmentLabel htmlFor="phone">Телефон</AppointmentLabel>
                    <AppointmentInput
                        onChange={({
                            target
                        }: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange({
                                name: target.name,
                                value: target.value
                            })
                        }
                        id="phone"
                        placeholder="Номер телефона"
                        type="text"
                        name="phone"
                        value={data.phone}
                    />
                </InputWrapper>
                <InputWrapper>
                    <AppointmentLabel htmlFor="service">
                        Услуга
                    </AppointmentLabel>
                    <Select
                        options={options}
                        isSearchable={false}
                        onChange={(data: OnChangeValue<Option, false>) =>
                            handleChange({
                                name: "service",
                                value: JSON.stringify(data)
                            })
                        }
                        placeholder="Что делаем?"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "black",
                                primary75: "black",
                                primary50: "black",
                                primary25: "lightgray"
                            }
                        })}
                        styles={{
                            container: (baseStyles) => ({
                                ...baseStyles,
                                width: "100%"
                            }),
                            control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: "lightgray",
                                cursor: "pointer"
                            }),
                            singleValue: (baseStyles) => ({
                                ...baseStyles,
                                textAlign: "center",
                                fontFamily: "cursive",
                                fontSize: "14px"
                            }),
                            placeholder: (baseStyles) => ({
                                ...baseStyles,
                                textAlign: "center",
                                fontFamily: "cursive"
                            }),
                            option: (baseStyles) => ({
                                ...baseStyles,
                                textAlign: "center",
                                fontFamily: "cursive"
                            })
                        }}
                        id="service"
                        name="service"
                    />
                </InputWrapper>
                {notes.length > 0 && (
                    <InputWrapper>
                        <AppointmentLabel htmlFor="date">Дата</AppointmentLabel>
                        <DatePicker
                            placeholderText="когда?"
                            showIcon
                            dateFormat="dd/MM/yyyy"
                            id="date"
                            name={Math.random() + "date"}
                            selected={data.date}
                            className="date-picker"
                            locale="ru"
                            includeDates={includeDatesRef.current}
                            onChange={(date: Date) =>
                                handleChange({
                                    name: "date",
                                    value: date
                                })
                            }
                        />
                    </InputWrapper>
                )}

                {times.length > 0 && (
                    <InputWrapper>
                        <AppointmentLabel htmlFor="time">
                            Время
                        </AppointmentLabel>
                        <DatePicker
                            placeholderText="Восколько?"
                            showIcon
                            name={Math.random() + "time"}
                            className="date-picker"
                            id="time"
                            selected={data.time}
                            onChange={(date: Date) =>
                                handleChange({
                                    name: "time",
                                    value: date
                                })
                            }
                            showTimeSelect
                            locale="ru"
                            showTimeSelectOnly
                            timeClassName={getTimesClassname}
                            timeIntervals={120}
                            timeCaption="Time"
                            dateFormat="HH:mm"
                        />
                    </InputWrapper>
                )}
                {errors && (
                    <AppointmentErrorMessage>{errors}</AppointmentErrorMessage>
                )}
                <Button
                    type="button"
                    disabled={isDisabled}
                    onClick={handleSubmit}
                >
                    Записаться
                </Button>
                {isDisabled && (
                    <AppointmentButtonMessage>
                        Кнопка станет доступна после заполнения всех полей.
                    </AppointmentButtonMessage>
                )}
            </AppointForm>
        </AppointmentWrapper>
    );
};

export default AppointmentForm;
