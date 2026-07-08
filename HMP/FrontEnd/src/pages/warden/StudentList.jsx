import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, RefreshCw, X, Heart } from "lucide-react";
import apiClient from "@/api/axios";

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [chronicFilter, setChronicFilter] = useState("ALL");

  const fetchStudents = async (searchVal = search, chronic = chronicFilter) => {
    setLoading(true);
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (chronic !== "ALL") params.hasChronicDisease = chronic;
      const res = await apiClient.get("/api/v1/warden/students", { params });
      setStudents(res.data.data?.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  // Run search after user stops typing for 400ms
  useEffect(() => {
    const timer = setTimeout(() => fetchStudents(), 400);
    return () => clearTimeout(timer);
  }, [search, chronicFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">

      {/* ── Header ── */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Users size={22} className="text-purple-600 dark:text-purple-400" /> Student List
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {loading ? "Loading…" : `${students.length} student${students.length !== 1 ? "s" : ""} in your hostel`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 min-w-52">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or enrollment no."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:bg-white dark:focus:bg-gray-800 transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Chronic Filter */}
            <select
              value={chronicFilter}
              onChange={(e) => setChronicFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 cursor-pointer"
            >
              <option value="ALL">All Students</option>
              <option value="true">With Chronic Condition</option>
              <option value="false">No Chronic Condition</option>
            </select>

            {/* Refresh */}
            <button
              onClick={() => fetchStudents()}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition"
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400" />
          <p className="text-purple-600 dark:text-purple-400 font-medium text-sm animate-pulse">Loading students...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Users size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400 font-semibold">No students found.</p>
          {(search || chronicFilter !== "ALL") && (
            <button onClick={() => { setSearch(""); setChronicFilter("ALL"); }} className="text-purple-600 dark:text-purple-400 text-sm font-bold mt-2 hover:underline">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-5 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <div className="col-span-5">Student</div>
            <div className="col-span-2 text-center">Room</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2 text-center">Health</div>
          </div>

          {/* Table Rows */}
          {students.map((student, index) => (
            <button
              key={student._id}
              onClick={() => navigate(`/warden/dashboard/students/${student._id}`)}
              className={`w-full grid grid-cols-12 px-5 py-4 items-center text-left hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition group border-b border-gray-50 dark:border-gray-700 ${index === students.length - 1 ? "border-b-0" : ""}`}
            >
              {/* Name + Enrollment */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">
                  {student.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm group-hover:text-purple-700 dark:group-hover:text-purple-400 transition">{student.fullName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{student.username}</p>
                </div>
              </div>

              {/* Room */}
              <div className="col-span-2 text-center">
                <span className="text-sm font-semibold text-gray-700  bg-gray-100 dark:bg-gray-750 px-3 py-1 rounded-lg">
                  {student.roomNumber || "—"}
                </span>
              </div>

              {/* Email */}
              <div className="col-span-3">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{student.email || "—"}</p>
              </div>

              {/* Health */}
              <div className="col-span-2 flex justify-center">
                {student.hasChronicDisease ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                    <Heart size={11} /> Chronic
                  </span>
                ) : (
                  <span className="text-xs text-gray-300 dark:text-gray-650 font-medium">—</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;