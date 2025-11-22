'use client';

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 px-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Branding */}
                <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-white">Jatree</h2>
                    <p className="text-gray-400">
                        Fast, safe, and easy bus booking platform for your travels.
                    </p>
                    <div className="flex space-x-4 mt-2">
                        <a href="#" className="hover:text-white transition-colors"><FaFacebookF /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaTwitter /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
                        <a href="#" className="hover:text-white transition-colors"><FaLinkedinIn /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                    <a href="#" className="hover:text-white transition-colors">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Book Ticket</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Contact Us</a>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col space-y-2">
                    <h3 className="text-lg font-semibold text-white">Contact Us</h3>
                    <p>123 Main Street, Dhaka, Bangladesh</p>
                    <p>Email: support@busify.com</p>
                    <p>Phone: +880 123 456 789</p>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Jatree. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
