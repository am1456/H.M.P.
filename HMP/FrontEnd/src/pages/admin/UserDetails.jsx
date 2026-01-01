import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios.js';
import { 
    ArrowLeft, Building, DoorOpen, Mail, Phone, 
    ShieldCheck, User as UserIcon, Edit3, Save, 
    XCircle, ShieldAlert, Trash2, Calendar
} from 'lucide-react';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    // Core States
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Form & Loading States
    const [formData, setFormData] = useState({});
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            const res = await apiClient.get(`/api/v1/admin/users/${userId}`);
            if (res.data.success) {
                setUser(res.data.data);
                setFormData(res.data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        setActionLoading(true);
        try {
            const res = await apiClient.patch(`/api/v1/admin/users/${userId}`, formData);
            if (res.data.success) {
                setUser(res.data.data);
                setIsEditing(false);
                alert("Profile Updated!");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Update failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        setActionLoading(true);
        try {
            const res = await apiClient.delete(`/api/v1/admin/delete-user/${userId}`);
            if (res.data.success) {
                navigate('/admin/dashboard/search-user');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
            setShowDeleteModal(false);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold animate-pulse text-gray-400">LOADING AUTHORIZED PROFILE...</div>;
    if (!user) return <div className="p-20 text-center text-red-500 font-bold">USER NOT FOUND</div>;

    const themeColor =  user.role === 'warden' ? 'purple' : 'emerald';

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-top-4 duration-700">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all font-bold text-xs tracking-widest">
                    <ArrowLeft size={16} /> BACK TO DIRECTORY
                </button>
                
                <div className="flex gap-3">
                    {!isEditing ? (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className={`flex items-center gap-2 px-6 py-2.5 bg-${themeColor}-600 text-white rounded-xl shadow-lg hover:shadow-${themeColor}-500/30 transition-all font-bold text-xs uppercase tracking-tighter`}
                            >
                                <Edit3 size={14} /> Edit Profile
                            </button>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-bold text-xs uppercase tracking-tighter"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-xl font-bold text-xs uppercase">Cancel</button>
                            <button 
                                onClick={handleUpdate} 
                                disabled={actionLoading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg font-bold text-xs uppercase"
                            >
                                {actionLoading ? "Saving..." : <><Save size={14} /> Save Changes</>}
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                {/* Banner */}
                <div className={`bg-linear-to-br from-${themeColor}-700 via-${themeColor}-600 to-${themeColor}-500 p-12 text-white relative`}>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                            <UserIcon size={56} />
                        </div>
                        <div className="text-center md:text-left">
                            {isEditing ? (
                                <input 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleInputChange}
                                    className="bg-white/20 border border-white/40 rounded-xl px-4 py-2 text-3xl font-black focus:outline-none focus:bg-white/30 w-full"
                                />
                            ) : (
                                <h2 className="text-4xl font-black tracking-tight">{user.fullName}</h2>
                            )}
                            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                                <p className="opacity-70 font-mono text-sm tracking-widest uppercase">@{user.username}</p>
                                <span className="px-3 py-1 bg-black/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <ShieldAlert size={180} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
                </div>

                {/* Content Grid */}
                <div className="p-10 md:p-14 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Section */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 dark:border-gray-700 pb-4">Contact Gateway</h4>
                        
                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block group-focus-within:text-emerald-500 transition-colors">Registered Email</label>
                                {isEditing ? (
                                    <input name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all" />
                                ) : (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-semibold"><Mail size={18} className="text-gray-400" /> {user.email}</div>
                                )}
                            </div>

                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block group-focus-within:text-emerald-500 transition-colors">Mobile Reference</label>
                                {isEditing ? (
                                    <input name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-xl outline-none transition-all" />
                                ) : (
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-semibold"><Phone size={18} className="text-gray-400" /> {user.mobile || "N/A"}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Assignment Section */}
                    <div className="space-y-8">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] border-b border-gray-100 dark:border-gray-700 pb-4">Infrastructure Detail</h4>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className={`p-3 bg-${themeColor}-100 dark:bg-${themeColor}-900/30 text-${themeColor}-600 rounded-xl`}><Building size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Assigned Hostel</p>
                                    <p className="font-bold text-gray-700 dark:text-gray-200">{user.hostel?.name || "System Admin Access"}</p>
                                </div>
                            </div>

                            {user.role === 'student' && (
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl"><DoorOpen size={20} /></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Allocated Room</p>
                                        <p className="font-bold text-gray-700 dark:text-gray-200">Room {user.room?.number || "Unassigned"}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-xl"><Calendar size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Member Since</p>
                                    <p className="font-bold text-gray-700 dark:text-gray-200">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-10 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete User?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">This will permanently remove <span className="font-bold text-red-600">{user.fullName}</span> from the management system.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDelete} disabled={actionLoading} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-200 dark:shadow-none">
                                {actionLoading ? "Deleting..." : "Confirm Delete"}
                            </button>
                            <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 text-gray-400 font-bold uppercase text-xs tracking-widest hover:text-gray-600">Go Back</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;