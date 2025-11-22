export interface DroppingPoint {
    name: string;
    price: number;
}

export interface District {
    name: string;
    dropping_points: DroppingPoint[];
}

export interface BusData {
    districts: District[];
}
