'use client';

import React, { useState } from 'react';
import TicketForm from '@/components/TicketForm';

const Hero: React.FC = () => {
    const [openForm, setOpenForm] = useState<boolean>(false);

    return (
        <div className="mt-15 flex flex-col items-center justify-center px-[190px]">

            {/* Heading with subtle hover effect */}
            <h1 className="text-5xl font-serif text-center mb-4 text-gray-900 
                           drop-shadow-md hover:scale-105 transition-transform duration-300 relative">
                Your Journey, Your Way — Book Bus Tickets in Seconds!
                <span className="absolute left-1/2 bottom-0 w-24 h-1 bg-blue-600 rounded-full -translate-x-1/2"></span>
            </h1>

            {/* Subheading with soft shadow */}
            <p className="text-lg text-center mb-8 text-gray-700 drop-shadow-sm hover:text-gray-800 transition-colors duration-300">
                Your travel companion for safe, quick, and easy bus rides
            </p>

            {/* Button with gradient + shadow + hover animation */}
            <button
                onClick={() => setOpenForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 
                           text-white font-semibold px-6 py-3 rounded-lg 
                           shadow-lg hover:shadow-xl hover:scale-105 
                           transition-all duration-300"
            >
                Book a Ticket
            </button>

            {/* Ticket Form */}
            <TicketForm open={openForm} onClose={() => setOpenForm(false)} />
        </div>
    );
};

export default Hero;
