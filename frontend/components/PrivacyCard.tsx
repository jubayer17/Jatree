'use client';

import React from 'react';

interface PrivacyCardProps {
    company: string;
    address: string;
    contact: string;
    policyLink: string;
    image: string;
}

const PrivacyCard: React.FC<PrivacyCardProps> = ({ company, address, contact, policyLink, image }) => {
    return (
        <div
            className="relative w-80 h-96 rounded-xl overflow-hidden shadow-xl shrink-0"
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* blackish gradient from bottom to top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* text section */}
            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <h2 className="text-xl font-bold">{company}</h2>

                <p className="text-sm opacity-90 mt-1">{address}</p>
                <p className="text-sm opacity-90 mt-1">{contact}</p>

                <a
                    href={policyLink}
                    className="text-sm underline opacity-90 hover:opacity-100 mt-2 inline-block"
                    target="_blank"
                    rel="noreferrer"
                >
                    View Policy
                </a>
            </div>
        </div>
    );
};

export default PrivacyCard;
