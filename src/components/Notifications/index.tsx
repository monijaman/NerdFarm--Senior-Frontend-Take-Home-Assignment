"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ToastNotificationProps {
    message: string;
    type: 'success' | 'error';
}

const ToastNotification = ({ message, type }: ToastNotificationProps) => {
    const [show, setShow] = useState(true); // Initialize the toast as visible on mount

    // Define background color and icon based on the toast type
    const bgColor = type === 'success' ? '#0C9949' : '#FF0000';
    const Icon = type === 'success' ? "/svgs/check_circle.svg" : "/svgs/error.svg";


    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 10000); // Automatically hide the toast after 3 seconds

        return () => clearTimeout(timer); // Clear the timeout when the component unmounts
    }, []);


    // Handle the close action manually when the close button is clicked
    const handleClose = () => {
        setShow(false); // Set show to false to hide the toast
    };

    return (
        <div
            className={`shadow-lg   fixed top-4 left-1/2 transform -translate-x-1/2 flex items-center p-4 gap-2 rounded-[6px]    bg-white w-[100%] max-w-[800px]  transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-20 opacity-0'}`}
            style={{ zIndex: 200 }
            }  >
            <span style={{ backgroundColor: bgColor }}
                className={`left-line absolute left-[1px] rounded-tl-[6px] rounded-bl-[6px] border border-white h-full w-[6px] bg-[${bgColor}]`}
            />


            <Image alt={type} src={Icon} width={20} height={20} />
            <span className="text-16 text-text-default font-medium">{message}</span>
            <button
                className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={handleClose} // Close the toast when the button is clicked
            >
                <Image alt='Close' src="/svgs/cross.svg" width={16} height={16} />
            </button>
        </div >
    );
};

export default ToastNotification;
