'use client';

import React from 'react';
import Lottie from 'lottie-react';
import ticketLottie from '@/utils/ticketLottie.json';
import { FaTicketAlt, FaBus, FaWallet } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation'; // Next.js router

interface User {
    name: string;
    email: string;
}

const Hero: React.FC = () => {
    const { user } = useAppContext();
    const router = useRouter();

    const handleBookTicket = () => {
        if (user) {
            // Redirect to dedicated book ticket page
            router.push('/book-ticket');
        } else {
            toast.warn('Please login first to book ticket!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="mt-15 flex flex-col md:flex-row items-center justify-between px-[110px] gap-10">
            {/* Left Side: Text */}
            <div className="flex-1 -mt-20 mr-20 flex flex-col justify-center">
                <h1 className="text-5xl text-gray-900 font-bold mb-4 hover:scale-105 transition-transform duration-300 relative">
                    Your Journey, Your Way — Book Bus Tickets in Seconds!
                    <span className="absolute left-0 md:left-0 bottom-0 w-32 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                </h1>
                <p className="text-lg text-gray-700 mb-6 hover:text-gray-800 transition-colors duration-300">
                    Travel safe, fast, and hassle-free with our easy-to-use booking platform.
                </p>

                <ul className="mb-6 space-y-3">
                    <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                        <FaTicketAlt className="text-red-500 w-6 h-6" />
                        Instant Booking & E-Tickets
                    </li>
                    <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                        <FaBus className="text-green-500 w-6 h-6" />
                        Multiple Bus Operators
                    </li>
                    <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-300">
                        <FaWallet className="text-yellow-500 w-6 h-6" />
                        Easy Payment Options
                    </li>
                </ul>

                {/* CTA Button */}
                <button
                    onClick={handleBookTicket}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                    Book a Ticket
                </button>
            </div>

            {/* Right Side: Lottie Animation */}
            <div className="ml-10 w-64 h-64 md:w-[460px] md:h-[460px]">
                <Lottie animationData={ticketLottie} loop={true} />
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default Hero;
