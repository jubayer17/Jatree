'use client';

import React, { useState, useEffect } from 'react';
import busDataJson from '@/utils/busData.json';
import { BusData, District, DroppingPoint } from '@/types/types';

const busData: BusData = busDataJson as BusData;

interface TicketFormProps {
    open: boolean;
    onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ open, onClose }) => {
    const [district, setDistrict] = useState<string>('');
    const [dropPoint, setDropPoint] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [formData, setFormData] = useState({
        fullname: '',
        phone: ''
    });

    useEffect(() => {
        if (!open) {
            setDistrict('');
            setDropPoint('');
            setPrice(0);
            setFormData({ fullname: '', phone: '' });
        }
    }, [open]);

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDistrict(e.target.value);
        setDropPoint('');
        setPrice(0);
    };

    const handleDropPointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setDropPoint(selected);

        const dist: District | undefined = busData.districts.find(d => d.name === district);
        const dp: DroppingPoint | undefined = dist?.dropping_points.find(p => p.name === selected);
        setPrice(dp?.price || 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Ticket booked for ${formData.fullname} at ${dropPoint}, Cost: ${price} BDT`);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Book Your Ticket</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="border rounded-md p-2 w-full"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="border rounded-md p-2 w-full"
                        required
                    />
                    <select
                        value={district}
                        onChange={handleDistrictChange}
                        className="border rounded-md p-2 w-full"
                        required
                    >
                        <option value="">Select District</option>
                        {busData.districts.map(d => (
                            <option key={d.name} value={d.name}>{d.name}</option>
                        ))}
                    </select>
                    <select
                        value={dropPoint}
                        onChange={handleDropPointChange}
                        className="border rounded-md p-2 w-full"
                        disabled={!district}
                        required
                    >
                        <option value="">Select Drop Point</option>
                        {district && busData.districts
                            .find(d => d.name === district)
                            ?.dropping_points.map(p => (
                                <option key={p.name} value={p.name}>
                                    {p.name} ({p.price} BDT)
                                </option>
                            ))}
                    </select>
                    {price > 0 && (
                        <p className="text-right font-semibold text-blue-700">
                            Cost: {price} BDT
                        </p>
                    )}
                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md border"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
