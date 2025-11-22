'use client';

import React from 'react';
import { FaStar } from 'react-icons/fa';

const Testimonials: React.FC = () => {
    const reviews = [
        {
            name: "Ahsan R.",
            role: "Frequent Traveler",
            avatar: "https://i.pravatar.cc/100?img=12",
            rating: 5,
            comment: "Booking tickets has never been this easy! I love the instant confirmations and smooth interface.",
        },
        {
            name: "Maya S.",
            role: "Student",
            avatar: "https://i.pravatar.cc/100?img=32",
            rating: 4,
            comment: "I always find the best buses at affordable prices. The platform is very reliable.",
        },
        {
            name: "Riyad H.",
            role: "Business Traveler",
            avatar: "https://i.pravatar.cc/100?img=44",
            rating: 5,
            comment: "Safe, fast, and hassle-free! Booking my rides has become so convenient.",
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-gray-100 px-8">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                    What Our Travelers Say
                </h2>
                <p className="text-gray-600 text-lg">
                    Hear from our happy customers and make your next journey stress-free.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {reviews.map((review, idx) => (
                    <div
                        key={idx}
                        className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center 
                                   hover:scale-105 hover:shadow-3xl transition-transform duration-500"
                        style={{
                            transform: `rotate(${idx === 1 ? '-1deg' : idx === 2 ? '1deg' : '0deg'})`,
                        }}
                    >
                        <div className="absolute -top-10">
                            <img
                                src={review.avatar}
                                alt={review.name}
                                className="w-24 h-24 rounded-full ring-4 ring-pink-400 shadow-lg"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-14 mb-1">{review.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{review.role}</p>
                        <div className="flex mb-4">
                            {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`mx-0.5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
