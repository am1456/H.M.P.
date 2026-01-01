import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios.js';
import { 
    UserPlus, 
    Building2, 
    Mail, 
    Lock, 
    Phone, 
    DoorOpen, 
    GraduationCap, 
    Search,
    UserCircle,
    CheckCircle2
} from 'lucide-react';

const AddStudent = () => {
    const navigate = useNavigate();
    
    // States for Data and UI
    const [hostels, setHostels] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]); // Master list from DB
    const [filteredRooms, setFilteredRooms] = useState([]);   // List shown in dropdown
    const [roomSearch, setRoomSearch] = useState("");         // What's typed in the room input
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            role: "student"
        }
    });

    // Watch the hostel selection to trigger room fetching
    const selectedHostelId = watch("hostel");

    // 1. Fetch Hostels for the first dropdown on component mount
    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await apiClient.get('/api/v1/hostel/get-all-hostels');
                if (res.data.success) setHostels(res.data.data);
            } catch (error) {
                console.error("Failed to fetch hostels", error);
            }
        };
        fetchHostels();
    }, []);

    // 2. Cascading Logic: Fetch Rooms when Hostel changes
    useEffect(() => {
        if (!selectedHostelId) {
            setAvailableRooms([]);
            setFilteredRooms([]);
            setRoomSearch("");
            setValue("room", ""); // Clear hidden room ID
            return;
        }

        const fetchRooms = async () => {
            try {
                const res = await apiClient.get(`/api/v1/room/get-rooms/${selectedHostelId}`);
                if (res.data.success) {
                    setAvailableRooms(res.data.data);
                    setFilteredRooms(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching rooms", error);
            }
        };

        fetchRooms();
    }, [selectedHostelId, setValue]);

    // 3. Search Logic for the Room Input
    const handleRoomSearch = (e) => {
        const value = e.target.value;
        setRoomSearch(value);
        
        // Filter rooms based on typed numbers
        const filtered = availableRooms.filter(room => 
            room.number.toString().toLowerCase().includes(value.toLowerCase())
        );
        setFilteredRooms(filtered);

        // If user clears the input, clear the actual form value
        if (value === "") setValue("room", "");
    };

    // 4. Handle selecting a room from the custom dropdown
    const selectRoom = (room) => {
        setRoomSearch(`Room ${room.number}`);
        setValue("room", room._id); // This sets the actual ID for the backend
        setFilteredRooms([]);       // Close dropdown
    };

    const onSubmit = async (data) => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const response = await apiClient.post('/api/v1/admin/create-student', data);
            if (response.data.success) {
                setMessage({ type: 'success', text: "Student enrollment successful!" });
                reset();
                setRoomSearch("");
                setTimeout(() => navigate('/admin/dashboard/add-student'), 2000);
            }
        } catch (error) {
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || "Enrollment failed" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                
                {/* Header - Emerald/Green Theme */}
                <div className="bg-linear-to-r from-emerald-800 via-emerald-600 to-teal-500 p-8 text-white relative">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-extrabold flex items-center gap-3">
                            <GraduationCap size={32} /> Student Enrollment
                        </h2>
                        <p className="text-emerald-100 mt-2 text-sm font-medium opacity-90 uppercase tracking-widest">
                            Academic Housing Registration
                        </p>
                    </div>
                    <UserPlus size={120} className="absolute -right-4 -top-4 text-white opacity-10 rotate-12" />
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`mx-8 mt-6 p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${
                        message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-sm">{message.text}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Full Name */}
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600 transition-colors">
                                <UserCircle size={14} /> Full Name
                            </label>
                            <input 
                                {...register("fullName", { required: "Full Name is required" })}
                                placeholder="Student Full Name"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-emerald-600'
                                }`}
                            />
                        </div>

                        {/* Username */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                @ Username
                            </label>
                            <input 
                                {...register("username", { required: "Username is required" })}
                                placeholder="Roll Number"
                                className={`w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl outline-none transition-all duration-300 dark:text-white ${
                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-emerald-600'
                                }`}
                            />
                        </div>

                        {/* Mobile */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                <Phone size={14} /> Contact Number
                            </label>
                            <input 
                                {...register("mobile", { 
                                    required: "Mobile is required",
                                    pattern: { value: /^[0-9]{10}$/, message: "10 digits required" }
                                })}
                                placeholder="10-digit mobile"
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl border-transparent outline-none focus:border-emerald-600 transition-all dark:text-white"
                            />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                <Mail size={14} /> Email
                            </label>
                            <input 
                                {...register("email", { required: "Email is required" })}
                                type="email"
                                placeholder="Enter the email address"
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl border-transparent outline-none focus:border-emerald-600 transition-all dark:text-white"
                            />
                        </div>

                        {/* Hostel Selection (Step 1) */}
                        <div className="group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                <Building2 size={14} /> 1. Select Hostel
                            </label>
                            <select 
                                {...register("hostel", { required: "Hostel assignment is required" })}
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl border-transparent outline-none focus:border-emerald-600 transition-all dark:text-white appearance-none cursor-pointer"
                            >
                                <option value="">-- Select Building --</option>
                                {hostels.map((h) => (
                                    <option key={h._id} value={h._id}>{h.name} ({h.code})</option>
                                ))}
                            </select>
                        </div>

                        {/* Smart Room Selector (Step 2: Search + Dropdown) */}
                        <div className="group relative">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                <DoorOpen size={14} /> 2. Search & Select Room
                            </label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    placeholder={selectedHostelId ? "Type room number..." : "Select hostel first"}
                                    disabled={!selectedHostelId}
                                    value={roomSearch}
                                    onChange={handleRoomSearch}
                                    className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl border-transparent outline-none focus:border-emerald-600 transition-all dark:text-white pr-10"
                                    autoComplete="off"
                                />
                                <Search className="absolute right-3 top-4 text-gray-400" size={18} />
                                
                                {/* Hidden Field for Form Submission */}
                                <input type="hidden" {...register("room", { required: "Room selection is required" })} />
                            </div>

                            {/* Custom Cascading Dropdown */}
                            {selectedHostelId && filteredRooms.length > 0 && roomSearch !== `Room ${filteredRooms[0]?.number}` && (
                                <ul className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto custom-scrollbar">
                                    {filteredRooms.map(room => (
                                        <li 
                                            key={room._id} 
                                            onClick={() => selectRoom(room)}
                                            className="p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer border-b last:border-0 border-gray-50 dark:border-gray-700 transition-colors flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="font-bold text-gray-800 dark:text-white">Room {room.number}</span>
                                                <p className="text-[10px] text-gray-400 uppercase">Capacity: {room.capacity}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-1 rounded-full font-bold">
                                                    SPACE AVAILABLE
                                                </span>
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Password */}
                        <div className="md:col-span-2 group">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 group-focus-within:text-emerald-600">
                                <Lock size={14} /> Student Account Password
                            </label>
                            <input 
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                placeholder="••••••••"
                                className="w-full p-3.5 bg-gray-50 dark:bg-gray-900 border-2 rounded-xl border-transparent outline-none focus:border-emerald-600 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <input type="hidden" {...register("role")} />

                    <div className="pt-6">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-linear-to-r from-emerald-700 to-teal-600 text-white font-black py-4 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98] disabled:from-gray-400 disabled:to-gray-500 uppercase tracking-widest flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Finalize Enrollment"
                            )}
                        </button>
                    </div>
                </form>

                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em]">
                        Student Housing Agreement & Record Encryption Active
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddStudent;