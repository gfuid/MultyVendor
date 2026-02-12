import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#004d2c] text-white pt-16 pb-8">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">

                {/* 1. Brand & Company Info */}
                <div className="md:col-span-2 lg:col-span-2">
                    <h2 className="text-5xl font-black italic mb-6">TRIREME</h2>
                    <div className="flex gap-4 mb-8">
                        {/* Social Icons Placeholder */}
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors">in</div>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors">yt</div>
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors">ig</div>
                    </div>

                    <p className="text-[11px] opacity-70 leading-relaxed font-bold uppercase tracking-tight">
                        Company Name: SATIYA NUTRACEUTICALS PRIVATE LIMITED <br />
                        Corporate office Address: A Wing, 14th Flr, Unit No 1/4/5, A Block Tradelink, Kamala Mills Compound, Senapati Bapat Marg, Lower Parel(W), Mumbai, Maharashtra, India, 400012
                    </p>
                    <div className="mt-8">
                        <h4 className="font-bold text-sm mb-4">Sign up for exclusive deals and offers</h4>
                        <button className="bg-[#4ade80] text-[#004d2c] px-12 py-3 rounded-md font-black uppercase text-sm shadow-xl hover:bg-white transition-all">
                            SIGN UP
                        </button>
                        <p className="text-[10px] mt-2 opacity-50">By signing up, you agree to our Privacy Policy</p>
                    </div>
                </div>

                {/* 2. Concerns & Support Links */}
                <div>
                    <h4 className="font-black text-sm mb-6 uppercase tracking-wider">Concerns</h4>
                    <ul className="space-y-3 text-xs opacity-70 font-medium">
                        <li className="hover:text-green-400 cursor-pointer">Weight</li>
                        <li className="hover:text-green-400 cursor-pointer">Skin</li>
                        <li className="hover:text-green-400 cursor-pointer">Daily Wellbeing</li>
                        <li className="hover:text-green-400 cursor-pointer">Performance</li>
                        <li className="hover:text-green-400 cursor-pointer">Hair</li>
                        <li className="hover:text-green-400 cursor-pointer">Report An Error</li>
                    </ul>
                    <h4 className="font-black text-sm mt-10 mb-6 uppercase tracking-wider">Connect</h4>
                    <ul className="space-y-3 text-xs opacity-70 font-medium">
                        <li className="hover:text-green-400 cursor-pointer">Customer Care Details</li>
                        <li className="hover:text-green-400 cursor-pointer">Chat with us on Whatsapp</li>
                        <li className="hover:text-green-400 cursor-pointer">Track your order</li>
                        <li className="hover:text-green-400 cursor-pointer">Bugs & Suggestion</li>
                        <li className="hover:text-green-400 cursor-pointer">Career</li>
                    </ul>
                </div>

                {/* 3. Learn & Legal */}
                <div>
                    <h4 className="font-black text-sm mb-6 uppercase tracking-wider">Learn</h4>
                    <ul className="space-y-3 text-xs opacity-70 font-medium">
                        <li className="hover:text-green-400 cursor-pointer">Blog</li>
                        <li className="hover:text-green-400 cursor-pointer">Our Story</li>
                        <li className="hover:text-green-400 cursor-pointer">Personal Guidance</li>
                        <li className="hover:text-green-400 cursor-pointer">Cashback</li>
                        <li className="hover:text-green-400 cursor-pointer">Clean Label Project</li>
                        <li className="hover:text-green-400 cursor-pointer">Pledge A Tree</li>
                    </ul>
                </div>

                {/* 4. Contact Details */}
                <div>
                    <h4 className="font-black text-sm mb-6 uppercase tracking-wider">Legal</h4>
                    <ul className="space-y-3 text-xs opacity-70 font-medium leading-relaxed">
                        <li className="hover:text-green-400 cursor-pointer">Refund & Cancellation</li>
                        <li className="hover:text-green-400 cursor-pointer">Privacy Policy</li>
                        <li className="hover:text-green-400 cursor-pointer">Terms & Conditions</li>
                        <li>hello@plixlife.com</li>
                        <li>+91 93218 60981</li>
                        <li>Monday to Friday - 10:00 am to 7:00 pm</li>
                        <li>Saturday & Sunday - Closed</li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

export default Footer;