"use client";

import React, { useState, useEffect } from "react";
import busDataJson from "@/utils/busData.json";
import { BusData, District, DroppingPoint } from "@/types/types";
import { toast } from "react-toastify";

const busData: BusData = busDataJson as BusData;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface TicketFormProps {
    open: boolean;
    onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ open, onClose }) => {
    const [district, setDistrict] = useState<string>("");
    const [dropPoint, setDropPoint] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [formData, setFormData] = useState({
        fullname: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setDistrict("");
            setDropPoint("");
            setPrice(0);
            setFormData({ fullname: "", phone: "" });
            setLoading(false);
        }
    }, [open]);

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDistrict(e.target.value);
        setDropPoint("");
        setPrice(0);
    };

    const handleDropPointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setDropPoint(selected);

        const dist: District | undefined = busData.districts.find((d) => d.name === district);
        const dp: DroppingPoint | undefined = dist?.dropping_points.find((p) => p.name === selected);
        setPrice(dp?.price || 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            // 1) Try cookie-based auth: call /auth/me to verify cookie is present & valid
            const meRes = await fetch(`${API_BASE}/auth/me`, {
                method: "GET",
                credentials: "include" // IMPORTANT: sends httpOnly cookie
            });

            let useHeaderToken = false;
            let headerToken: string | null = null;

            if (meRes.ok) {
                // cookie is valid — proceed with cookie flow
            } else {
                // cookie didn't work: try dev token fallback (only for dev/testing)
                // NOTE: window.__DEV_AUTH_TOKEN is optional and should NOT be used in production
                // but it helps when testing with Postman or other api clients.
                headerToken = (window as any).__DEV_AUTH_TOKEN || null;
                if (!headerToken) {
                    toast.error("Please login first to book a ticket.");
                    setLoading(false);
                    return;
                }
                useHeaderToken = true;
            }

            // 2) Make the create ticket request
            const payload = {
                fullname: formData.fullname,
                phone: formData.phone,
                district,
                drop_point: dropPoint,
                price
            };

            const fetchOptions: RequestInit = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            };

            if (!useHeaderToken) {
                // cookie flow: include credentials so browser sends httpOnly cookie
                (fetchOptions as any).credentials = "include";
            } else {
                // header flow: set Authorization header
                (fetchOptions.headers as any)["Authorization"] = `Bearer ${headerToken}`;
            }

            const res = await fetch(`${API_BASE}/tickets/create`, fetchOptions);
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const err = data?.detail || data?.message || "Booking failed!";
                toast.error(String(err));
                setLoading(false);
                return;
            }

            toast.success("Ticket booked successfully!");
            onClose();
        } catch (err) {
            console.error("ticket booking error:", err);
            toast.error("Network error or server unreachable");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-90 z-50">
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
                    <select value={district} onChange={handleDistrictChange} className="border rounded-md p-2 w-full" required>
                        <option value="">Select District</option>
                        {busData.districts.map((d) => (
                            <option key={d.name} value={d.name}>
                                {d.name}
                            </option>
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
                        {district &&
                            busData.districts
                                .find((d) => d.name === district)
                                ?.dropping_points.map((p) => (
                                    <option key={p.name} value={p.name}>
                                        {p.name} ({p.price} BDT)
                                    </option>
                                ))}
                    </select>

                    {price > 0 && <p className="text-right font-semibold text-blue-700">Cost: {price} BDT</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700" disabled={loading}>
                            {loading ? "Booking..." : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketForm;
