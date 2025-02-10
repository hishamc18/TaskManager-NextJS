"use client";

import { fetchLoggedInUser, logoutUser } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchLoggedInUser());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            {/* Navbar */}
            <nav className="flex justify-between items-center p-4 bg-[#323233] text-white">
                <h1 className="text-xl font-bold">Taskify</h1>

                {/* Profile Section */}
                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <img
                            src={user?.photo || "/avatar.png"}
                            alt="Profile"
                            className="w-11 h-11 rounded-full border-2 border-gray-500"
                        />
                        <div className="flex flex-col text-left">
                            <span className="text-[14px]">{user?.user?.username || "User"}</span>
                            <span className="text-[11px] py-[2px] rounded-md">
                                {user?.user?.role || "User"}
                            </span>
                        </div>
                        <FaChevronDown
                            className={`text-sm transition-transform ${
                                isDropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                    </div>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-lg overflow-hidden z-10">
                            <button
                                onClick={() => setIsLogoutModalOpen(true)}
                                className="block w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white transition"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-40 z-20">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                        <h2 className="text-lg font-semibold mb-4">Are you sure you want to logout?</h2>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-[12px] text-white rounded-xl hover:bg-red-700 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded-xl text-[12px] hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
