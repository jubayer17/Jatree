'use client';

import React from 'react';
import PrivacyCard from './PrivacyCard';
import policiesData from '@/utils/privacyPolicies.json';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const PrivacySlider: React.FC = () => {
    return (
        <div className="relative py-16 px-6 md:px-10 bg-gradient-to-b from-gray-50 to-gray-200">

            {/* Section Title */}
            <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 tracking-tight">
                Find Your Trusted Travel Partner
            </h1>

            {/* Navigation Buttons */}
            <button
                className="privacy-prev absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-lg shadow-lg p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200"
            >
                ◀
            </button>

            <button
                className="privacy-next absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 
                bg-white/90 backdrop-blur-lg shadow-lg p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200"
            >
                ▶
            </button>

            {/* Slider */}
            <div className="flex justify-center">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={40}
                    slidesPerView={3}
                    navigation={{
                        nextEl: '.privacy-next',
                        prevEl: '.privacy-prev',
                    }}
                    className="max-w-6xl"
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {policiesData.privacyPolicies.map((policy) => (
                        <SwiperSlide key={policy.company}>
                            <PrivacyCard
                                company={policy.company}
                                address={policy.address}
                                contact={policy.contact}
                                policyLink={policy.policyLink}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default PrivacySlider;
