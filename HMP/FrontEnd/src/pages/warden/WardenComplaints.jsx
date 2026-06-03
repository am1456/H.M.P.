import React, { useEffect, useState } from "react";
import { 
  Filter, Search, AlertCircle, CheckCircle, 
  Clock, MapPin, User, ChevronDown, Wrench, RefreshCw 
} from "lucide-react";
import apiClient from "@/api/axios";

const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL"); 
  const [typeFilter, setTypeFilter] = useState("ALL"); 

  // 1. Fetch Complaints
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/v1/warden/complaints");
      // Safety: Ensure it's always an array
      setComplaints(res.data.data || []); 
    } catch (error) {
      console.error("Failed to fetch complaints", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // 2. Client-Side Filter Logic
  const filteredComplaints = complaints.filter(item => {
    // Status Check (Exact Match)
    const matchStatus = statusFilter === "ALL" || item.statusbyStudent === statusFilter;
    // Type Check (Exact Match)
    const matchType = typeFilter === "ALL" || item.assignedRole === typeFilter;
    
    return matchStatus && matchType;
  });

  // 3. Helper for category colors
  const getCategoryColor = (role) => {
    switch (role) {
      case "electrician": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "plumber": return "bg-blue-100 text-blue-700 border-blue-200";
      case "carpenter": return "bg-orange-100 text-orange-700 border-orange-200";
      case "cleaning": return "bg-green-100 text-green-700 border-green-200";
      case "internet": return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardListIcon /> Complaint Board
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and assign hostel maintenance issues.</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
           {/* Refresh Button */}
           <button 
             onClick={fetchComplaints}
             className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition border border-gray-200"
             title="Refresh List"
           >
             <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
           </button>

           {/* Status Filter - VALUES MUST MATCH DB (UPPERCASE) */}
           <div className="relative">
             <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
             >
               <option value="ALL">All Status</option>
               <option value="PENDING">Pending</option>
               <option value="RESOLVED">Resolved</option>
             </select>
             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
           </div>

           {/* Type Filter */}
           <div className="relative">
             <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer text-sm"
             >
               <option value="ALL">All Categories</option>
               <option value="electrician">Electrical</option>
               <option value="plumber">Plumbing</option>
               <option value="carpenter">Carpentry</option>
               <option value="cleaning">Cleaning</option>
               <option value="internet">Wi-Fi</option>
               <option value="other">Other</option>
             </select>
             <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
           </div>
        </div>
      </div>

      {/* COMPLAINTS LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-purple-600 font-medium animate-pulse">Fetching latest complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <AlertCircle size={32} />
          </div>
          <p className="text-gray-500 font-medium">No complaints found matching your filters.</p>
          <button onClick={() => {setStatusFilter("ALL"); setTypeFilter("ALL")}} className="text-purple-600 text-sm font-bold mt-2 hover:underline">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredComplaints.map((item) => (
            <div 
              key={item._id} 
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
            >
              {/* Status Bar Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.statusbyStudent === 'RESOLVED' ? 'bg-green-500' : 'bg-orange-500'}`}></div>

              <div className="flex flex-col md:flex-row gap-6 pl-4">
                
                {/* 1. Issue Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{item._id.slice(-6)}</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getCategoryColor(item.assignedRole)}`}>
                      {item.assignedRole}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                       <Clock size={12}/> {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                  
                  {/* Location & Student Badge (Fixed Mapping) */}
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <MapPin size={14} className="text-purple-600"/>
                        <span className="text-xs font-bold text-gray-700">
                            Room {item.roomNumber || "N/A"}
                        </span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <User size={14} className="text-purple-600"/>
                        <div className="flex flex-col leading-none">
                            <span className="text-xs font-bold text-gray-700">
                                {item.studentName || "Unknown Student"}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                                {item.enrollmentNo}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* 2. Assignment & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between min-w-50 gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  
                  {/* Current Status */}
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-1 ${
                      item.statusbyStudent === 'RESOLVED' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {item.statusbyStudent === 'RESOLVED' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                      {item.statusbyStudent}
                    </div>
                    
                    
                  </div>

                  {/* Action Button */}
                  {/* {item.statusbyStudent === 'PENDING' && (
                    <button 
                      className="w-full md:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-md shadow-purple-200 transition active:scale-95 flex items-center justify-center gap-2"
                      onClick={() => alert(`Next Step: Open 'Assign Staff' Modal for Complaint #${item._id.slice(-6)}`)}
                    >
                      <User size={14} /> 
                      {item.assignedStaff ? "Re-Assign" : "Assign Staff"}
                    </button>
                  )} */}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple Icon Component for the Header
const ClipboardListIcon = () => (
  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export default WardenComplaints;