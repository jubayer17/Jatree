'use client';

import React, { useState, useEffect } from 'react';
import busDataJson from '@/utils/busData.json';
import { BusData, District, DroppingPoint } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';

const busData: BusData = busDataJson as BusData;

const BookTicketPage: React.FC = () => {
    const { user } = useAppContext();
    const router = useRouter();
    const [district, setDistrict] = useState<string>('');
    const [dropPoint, setDropPoint] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [formData, setFormData] = useState({ fullname: '', phone: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) router.push("/login");
    }, [user, router]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token) return;

        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/tickets/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    fullname: formData.fullname,
                    phone: formData.phone,
                    district,
                    drop_point: dropPoint,
                    price
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.detail || "Booking failed!");
                setLoading(false);
                return;
            }

            alert("Ticket booked successfully!");
            router.push("/my-bookings");
        } catch (err) {
            console.error(err);
            alert("Network error!");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-10">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                    Book Your Bus Ticket
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="Full Name"
                        className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                    <select
                        value={district}
                        onChange={handleDistrictChange}
                        className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookTicketPage;
