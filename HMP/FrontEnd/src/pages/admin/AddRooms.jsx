import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '../../api/axios.js';
import { PlusCircle, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddRooms = () => {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [lastRoomMsg, setLastRoomMsg] = useState(null); // To store the hint text
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm();
    
    // Watch the dropdown to trigger the fetch
    const selectedHostelId = watch("hostelId");

    // 1. Fetch Hostels on Load for Dropdown
    useEffect(() => {
        const fetchHostels = async () => {
            const res = await apiClient.get('/api/v1/hostel/get-all-hostels');
            if (res.data.success) setHostels(res.data.data);
        };
        fetchHostels();
    }, []);

    // 2. Fetch Last Room when Dropdown Changes
    useEffect(() => {
        if (!selectedHostelId) {
            setLastRoomMsg(null);
            return;
        }

        const fetchLastRoom = async () => {
            try {
                const res = await apiClient.get(`/api/v1/room/last-room/${selectedHostelId}`);
                const lastNum = res.data.data.lastRoom;
                
                if (lastNum > 0) {
                    setLastRoomMsg(`Last registered room: ${lastNum}. Suggested start: ${lastNum + 1}`);
                    setValue("startRoomNumber", lastNum + 1); // AUTO-FILL for convenience!
                } else {
                    setLastRoomMsg("No rooms found. You can start with 101.");
                    setValue("startRoomNumber", 101);
                }
            } catch (error) {
                console.error("Could not fetch last room");
            }
        };

        fetchLastRoom();
    }, [selectedHostelId, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await apiClient.post('/api/v1/room/add-room', data);
            if (response.data.success) {
                alert(`${response.data.message}`);
                reset();
                navigate('/admin/dashboard/add-rooms');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 animate-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <PlusCircle className="text-blue-600" /> Add Extra Rooms
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
                
                {/* 1. Hostel Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Select Hostel</label>
                    <select 
                        {...register("hostelId", { required: "Please select a hostel" })} 
                        className="input-field w-full p-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-white border"
                    >
                        <option value="">-- Choose Building --</option>
                        {hostels.map((h) => (
                            <option key={h._id} value={h._id}>{h.name} ({h.code})</option>
                        ))}
                    </select>
                </div>

                {/* THE SMART HINT */}
                {lastRoomMsg && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Info size={16} />
                        <span>{lastRoomMsg}</span>
                    </div>
                )}

                {/* 2. Room Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Room No.</label>
                        <input type="number" {...register("startRoomNumber", { required: true })} className="input-field uppercasew-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">How many to add?</label>
                        <input type="number" {...register("totalRooms", { required: true, min: 1 })} className="input-field uppercasew-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" placeholder="e.g. 5" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Capacity</label>
                    <input type="number" {...register("capacity")} className="input-field uppercasew-full p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 rounded-lg" defaultValue="1" />
                </div>

                <button disabled={loading} className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                    {loading ? "Adding Rooms..." : "Add Rooms"}
                </button>
            </form>
        </div>
    );
};

export default AddRooms;