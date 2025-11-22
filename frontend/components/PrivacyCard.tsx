'use client';

import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaLink } from 'react-icons/fa';

interface PrivacyCardProps {
    company: string;
    address: string;
    contact: string;
    policyLink: string;
}

const PrivacyCard: React.FC<PrivacyCardProps> = ({ company, address, contact, policyLink }) => {
    return (
        <div className="relative w-80 h-96 rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300">

            {/* Company Name */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{company}</h2>

            {/* Info Section */}
            <div className="space-y-3">
                <p className="flex items-center text-gray-700">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" /> {address}
                </p>
                <p className="flex items-center text-gray-700">
                    <FaPhoneAlt className="mr-2 text-green-500" /> {contact}
                </p>
                <a
                    href={policyLink}
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FaLink className="mr-2 text-purple-500" /> View Policy
                </a>
            </div>

            {/* Decorative Bottom Accent */}
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-4"></div>
        </div>
    );
};

export default PrivacyCard;
