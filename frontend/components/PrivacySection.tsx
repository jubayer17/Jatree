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
        <div className="py-12 px-4 md:px-8 bg-gray-100 relative">

            <h1 className="text-4xl font-bold text-center mb-8">
                Bus Companies Privacy Policies
            </h1>

            {/* Custom navigation buttons (outside the slider) */}
            <button
                className="privacy-prev absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 
                bg-white shadow-md p-3 rounded-full hover:scale-110 transition"
            >
                ◀
            </button>

            <button
                className="privacy-next absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 
                bg-white shadow-md p-3 rounded-full hover:scale-110 transition"
            >
                ▶
            </button>

            {/* Center slider */}
            <div className="flex justify-center">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={20}
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
                                image="/placeholder.jpg"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default PrivacySlider;
