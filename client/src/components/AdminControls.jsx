"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { promoteUser, deleteUser, fetchAllUsers } from "@/redux/slices/authSlice";
import { useToast } from "./Toast";

export default function AdminControls({ selectedUser, setSelectedUser }) {
    const users = useSelector((state) => state.auth.users);
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();
    const { showToast } = useToast();

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    const handleUserSelect = (userId) => {
        const user = users.find((u) => u._id === userId);
        setSelectedUser(user);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await dispatch(deleteUser(userId));
            dispatch(fetchAllUsers());
            setSelectedUser(null);
            showToast("User Deleted Successfully");
        } catch (error) {
            showToast("Failed to delete user.");
        }
    };

    const handlePromoteUser = async (userId) => {
        try {
            await dispatch(promoteUser(userId));
            dispatch(fetchAllUsers());
            setSelectedUser(null);
            showToast("Promoted as Admin");
        } catch (error) {
            showToast("Failed to promote user.");
        }
    };

    const userTasks = selectedUser ? tasks.filter((task) => task.user === selectedUser._id) : [];

    const highPriorityCount = userTasks.filter((task) => task.priority === "high").length;
    const mediumPriorityCount = userTasks.filter((task) => task.priority === "medium").length;
    const lowPriorityCount = userTasks.filter((task) => task.priority === "low").length;

    return (
        <div className="bg-white p-3 shadow-lg rounded-lg mb-3 text-black flex flex-col items-center w-full max-w-2xl mx-auto scale-90">
            <h2 className="text-xl font-semibold mb-4 text-center">Admin Controls</h2>

            <select
                className="p-3 border rounded w-full text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleUserSelect(e.target.value)}
            >
                <option value="">All Tasks</option>
                {users.map((user) => (
                    <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                    </option>
                ))}
            </select>

            {selectedUser && (
                <div className="w-full bg-gray-200 p-4 rounded-lg mt-4 shadow-xl flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="text-center md:text-left">
                        <p className="text-lg font-semibold">{selectedUser.username}</p>
                        <p className="text-gray-600">{selectedUser.email}</p>
                        <div className="mt-3 flex gap-4 justify-center md:justify-start">
                            <button
                                className={`text-white text-[12px] px-2 py-2 rounded-lg transition ${
                                    selectedUser.role === "admin"
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                                onClick={() => handleDeleteUser(selectedUser._id)}
                            >
                                Delete User
                            </button>
                            <div className="relative group">
                                <button
                                    className={`text-white text-[12px] px-2 py-2 rounded-lg transition ${
                                        selectedUser.role === "admin"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                                    onClick={() => handlePromoteUser(selectedUser._id)}
                                    disabled={selectedUser.role === "admin"}
                                >
                                    Make Admin
                                </button>
                                {selectedUser.role === "admin" && (
                                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Already an Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 md:mt-0 bg-white shadow-md p-4 rounded-lg text-center w-full md:w-auto">
                        <p className="text-[13px] font-semibold">Task Priority</p>
                        <div className="mt-2">
                            <p className="text-red-500 text-[13px]">High: {highPriorityCount}</p>
                            <p className="text-yellow-500 text-[13px]">Medium: {mediumPriorityCount}</p>
                            <p className="text-green-500 text-[13px]">Low: {lowPriorityCount}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
