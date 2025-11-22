'use client';

import React from 'react';
import { FaBus, FaTicketAlt, FaClock, FaMobileAlt } from 'react-icons/fa';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            icon: <FaBus className="text-3xl text-blue-500" />,
            title: "Choose Your Bus",
            description: "Select from multiple bus operators and types according to your comfort and schedule.",
        },
        {
            icon: <FaTicketAlt className="text-3xl text-purple-500" />,
            title: "Book Tickets Instantly",
            description: "Easily book your tickets in seconds and get instant confirmation with e-ticket.",
        },
        {
            icon: <FaClock className="text-3xl text-green-500" />,
            title: "Flexible Timing",
            description: "Choose your preferred timing and enjoy punctual departures without delays.",
        },
        {
            icon: <FaMobileAlt className="text-3xl text-pink-500" />,
            title: "Pay Securely",
            description: "Pay with multiple secure payment options including cards, wallets, or online banking.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-8 relative">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-gray-600 text-lg">
                    Follow our simple process to book your bus tickets easily and safely.
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Vertical timeline line */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 bg-gray-300 h-full"></div>

                {steps.map((step, idx) => {
                    const isLeft = idx % 2 === 0;
                    return (
                        <div
                            key={idx}
                            className={`relative flex flex-col md:flex-row items-center mb-16 md:mb-20 ${isLeft ? "md:justify-start" : "md:justify-end"
                                }`}
                        >
                            {/* Step content */}
                            <div
                                className={`bg-white rounded-xl shadow-xl p-6 w-full md:w-5/12 flex flex-col items-start ${isLeft ? "md:ml-0 md:mr-auto text-left" : "md:mr-0 md:ml-auto text-right"
                                    }`}
                            >
                                <div className="mb-3 p-3 bg-gray-100 rounded-full inline-block">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>

                            {/* Timeline connector */}
                            <div className="absolute left-1/2 top-6 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
                                {step.icon}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HowItWorks;
