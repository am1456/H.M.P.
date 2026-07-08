import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, CheckCircle, Clock,
  AlertCircle, Wrench, MoreVertical
} from "lucide-react";
import apiClient from "@/api/axios";

const StudentComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Complaints
  const fetchComplaints = async () => {
    try {
      const res = await apiClient.get("/api/v1/student/my-complaints");
      setComplaints(res.data.data.complaints);
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 2. Resolve Logic (Mark as Done)
  const handleResolve = async (id) => {
    if (!window.confirm("Are you sure the issue is fixed?")) return;
    try {
      await apiClient.patch(`/api/v1/student/resolve-complaint/${id}`);
      // Optimistic Update: Update UI immediately without full reload
      setComplaints(prev => prev.map(c =>
        c._id === id ? { ...c, statusbyStudent: "RESOLVED" } : c
      ));
      alert("Complaint marked as Resolved!");
    } catch (error) {
      alert("Failed to update status");
    }
  };

  // 3. Delete Logic (Only if Staff hasn't touched it)
  const handleDelete = async (id) => {
    if (!window.confirm("Do you really want to delete this complaint?")) return;
    try {
      await apiClient.delete(`/api/v1/student/delete-complaint/${id}`);
      // Remove from UI
      setComplaints(prev => prev.filter((c) => (c._id !== id)));
    } catch (error) {
      alert(error.response?.data?.message || "Cannot delete this complaint");
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center text-emerald-600">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mr-2"></div>
      Loading Complaints...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Complaints</h1>
          <p className="text-gray-500 mt-1">Track the status of your maintenance requests.</p>
        </div>
        <button
          onClick={() => navigate("file-complaint")} // Will build this form next
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg"
        >
          <Plus size={20} /> New Complaint
        </button>
      </div>

      {/* COMPLAINTS LIST */}
      {complaints.length === 0 ? (
        // Empty State
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-600">No Complaints Found</h3>
          <p className="text-gray-400 text-sm">Everything seems to be working fine!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((item) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Left Color Bar based on Status */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.statusbyStudent === 'RESOLVED' ? 'bg-green-500' : 'bg-orange-500'}`}></div>

              <div className="flex flex-col md:flex-row justify-between gap-4 pl-4">

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      #{item._id.slice(-6)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase">
                      {item.assignedRole}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" /> {new Date(item.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit"
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>

                {/* Status & Actions Section */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 min-w-[140px]">

                  {/* Status Badges */}
                  <div className="text-right space-y-1">
                    <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.statusbyStudent === 'RESOLVED'
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                      }`}>
                      {item.statusbyStudent === 'RESOLVED' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      {item.statusbyStudent}
                    </div>

                    {/* Only show Staff status if it's NOT just 'UNSETTLED' (to reduce clutter) or if user is waiting */}
                    {item.statusbyStaff !== 'UNSETTLED' && (
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        Staff: {item.statusbyStaff}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* DELETE BUTTON: Only visible if Staff hasn't touched it yet */}
                    {item.statusbyStaff === 'UNSETTLED' && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Complaint"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    {/* RESOLVE BUTTON: Only visible if currently PENDING */}
                    {item.statusbyStudent === 'PENDING' && (
                      <button
                        onClick={() => handleResolve(item._id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2"
                      >
                        <CheckCircle size={14} /> Mark Resolved
                      </button>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentComplaints;