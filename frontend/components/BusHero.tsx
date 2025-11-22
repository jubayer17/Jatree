'use client';

import React from 'react';
import Lottie from 'lottie-react';
import busAnimation from "@/utils/busLottie.json"; // your downloaded lottie json

import { FaBus, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const BusHero: React.FC = () => {
    return (
        <div className="flex items-center bg-gray-100 rounded-xl p-8 gap-8">
            {/* Left side: Lottie */}
            <div className="w-1/2">
                <Lottie animationData={busAnimation} loop={true} />
            </div>

            {/* Right side: Text */}
            <div className="w-1/2 flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Book Your Bus Tickets in Seconds
                </h2>
                <p className="text-gray-600">
                    Safe, quick, and reliable travel at your fingertips.
                </p>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaBus className="text-blue-600" />
                        <span>Choose from top bus operators</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaClock className="text-green-600" />
                        <span>Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <FaMapMarkerAlt className="text-red-600" />
                        <span>Multiple drop & pickup points</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusHero;
