"use client"
import { createContext, useContext } from "react";
import toast from "react-hot-toast";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const showToast = (message, type) => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        } else {
            toast(message);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
