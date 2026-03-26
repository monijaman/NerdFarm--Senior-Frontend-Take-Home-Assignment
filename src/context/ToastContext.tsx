'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { ToastNotification } from '@/components';
// Define the type of toast notifications
type ToastType = 'success' | 'error';

// Define the structure of a toast object
interface Toast {
    message: string; // The message to display in the toast
    type: ToastType; // The type of toast (e.g., success or error)
}

// Define the structure of the context value
interface ToastContextProps {
    showToast: (message: string, type: ToastType) => void; // Function to display a toast
}

// Create the Toast context with an undefined initial value
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// ToastProvider component wraps the application to provide the toast functionality
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<Toast | null>(null); // State to hold the current toast or `null` if no toast is displayed

    // Function to show a toast
    const showToast = (message: string, type: ToastType) => {
        setToast({ message, type }); // Set the toast state with the provided message and type
        setTimeout(() => setToast(null), 10000); // Automatically hide the toast after 3 seconds
    };

    return (
        // Provide the `showToast` function to the rest of the app via context
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* If a toast exists, render the ToastNotification component */}
            {toast && <ToastNotification message={toast.message} type={toast.type} />}
        </ToastContext.Provider>
    );
};

// Custom hook to access the Toast context
export const useToast = () => {
    const context = useContext(ToastContext); // Access the context
    if (!context) {
        // Throw an error if the hook is used outside the ToastProvider
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context; // Return the context value
};
