export interface AppointmentData {
    name: string;
    value: Date | string;
}

export interface Option {
    value: string;
    label: string;
}
export interface Coords {
    x: string;
    y: string;
}

export interface TimeCellsData extends TimeData {
    cells: string;
}

export interface CoordsCellsData extends Coords {
    cells: string;
}

export interface Client {
    date?: Date | null;
    time?: Date | null;
    name?: string;
    phone?: string;
    coords: Coords[];
    service?: string | null;
}

export interface TimeData {
    timeString: string;
    x: number;
    y: number;
}

export interface ClientNote {
    value: string;
    date: Date;
    time: string;
    x: number;
    y: number;
}

export interface ClientDate {
    date: Date;
    x: number;
    y: number;
}

export interface ClientState {
    entities: Array<ClientNote>;
    times: Array<TimeData>;
    isLoading: boolean;
    dataLoaded: boolean;
    isTimeLoading: boolean;
    timeDataLoaded: boolean;
    error: string;
}
