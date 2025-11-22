'use client';

import React from 'react';
import { FaBus, FaClock, FaShieldAlt, FaMoneyCheckAlt } from 'react-icons/fa';

const WhyChooseUs: React.FC = () => {
    const features = [
        {
            icon: <FaBus className="text-4xl text-red-500" />,
            title: "Multiple Bus Options",
            description: "Choose from a wide range of buses and operators for your comfort and convenience.",
        },
        {
            icon: <FaClock className="text-4xl text-yellow-500" />,
            title: "Instant Booking",
            description: "Book your tickets within seconds and get instant e-tickets directly on your phone.",
        },
        {
            icon: <FaShieldAlt className="text-4xl text-green-500" />,
            title: "Safe & Secure",
            description: "Travel worry-free with our secure payment options and verified bus operators.",
        },
        {
            icon: <FaMoneyCheckAlt className="text-4xl text-blue-500" />,
            title: "Affordable Prices",
            description: "Get the best prices with flexible payment options and special offers.",
        },
    ];

    return (
        <section className="py-20 bg-gray-50 px-8">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Busify?</h2>
                <p className="text-gray-600 text-lg">
                    Experience the easiest and fastest way to book bus tickets for your next journey.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="bg-gradient-to-tr from-white to-gray-100 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
                    >
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
