import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Heart, Calendar, Shield, BookOpen, Clock, Users, Home, AlertTriangle } from "lucide-react";
import apiClient from "@/api/axios";

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get(`/api/v1/warden/student/${studentId}`)
      .then((res) => setDetail(res.data.data))
      .catch((err) => console.error("Failed to load student detail", err))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="h-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 dark:border-purple-400" />
        <p className="text-sm text-purple-600 dark:text-purple-400 animate-pulse">Loading Student Profile...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500 max-w-md mx-auto">
        <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Student Not Found</h2>
        <p className="text-sm mb-6">Could not load the requested student profile details.</p>
        <button
          onClick={() => navigate("/warden/dashboard/students")}
          className="flex items-center gap-2 mx-auto px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 transition"
        >
          <ArrowLeft size={16} /> Back to Student List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Back to list and Title area */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all font-bold text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Banner with profile initials and primary info */}
        <div className="bg-linear-to-br from-purple-700 via-purple-600 to-indigo-600 p-8 md:p-12 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl text-3xl font-black">
              {detail.fullName?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{detail.fullName}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="font-mono text-sm tracking-widest opacity-85">@{detail.username}</span>
                <span className="px-3 py-1 bg-black/20 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                  Room {detail.room?.number || "—"}
                </span>
                {detail.profile?.hasChronicDisease && (
                  <span className="px-3 py-1 bg-red-500/30 text-red-200 rounded-full text-[10px] font-bold uppercase tracking-widest border border-red-400/20">
                    <AlertTriangle size={16} className="inline-block mr-1" /> Chronic
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800">
          
          {/* Contact Details */}
          <Section title="Contact Information">
            <Row label="Email" value={detail.email || "—"} />
            <Row label="Phone" value={detail.mobile || "—"} />
          </Section>

          {/* Personal details */}
          <Section title="Personal Information">
            <Row label="Gender" value={detail.profile?.gender || "—"} />
            <Row label="Date of Birth" value={detail.profile?.dateOfBirth ? new Date(detail.profile.dateOfBirth).toLocaleDateString("en-GB") : "—"} />
            <Row label="Blood Group" value={detail.profile?.bloodGroup || "—"} />
          </Section>

          {/* Academic Profile */}
          <Section title="Academic Roster">
            <Row label="Enrollment No." value={detail.username || "—"} />
            <Row label="Hostel Allocation" value={detail.hostel?.name || "—"} />
            <Row label="Member Since" value={detail.createdAt ? new Date(detail.createdAt).toLocaleDateString("en-GB") : "—"} />
          </Section>

          {/* Family details */}
          {(detail.profile?.fatherName || detail.profile?.motherName) && (
            <Section title="Family Contacts">
              {detail.profile?.fatherName && <Row label="Father" value={`${detail.profile.fatherName}${detail.profile.fatherPhone ? ` · ${detail.profile.fatherPhone}` : ""}`} />}
              {detail.profile?.motherName && <Row label="Mother" value={`${detail.profile.motherName}${detail.profile.motherPhone ? ` · ${detail.profile.motherPhone}` : ""}`} />}
            </Section>
          )}

          {/* Permanent Address */}
          {detail.profile?.addressLine1 && (
            <div className="md:col-span-2">
              <Section title="Address Details">
                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {[detail.profile.addressLine1, detail.profile.city, detail.profile.state, detail.profile.pincode].filter(Boolean).join(", ")}
                </div>
              </Section>
            </div>
          )}

          {/* Emergency Contacts */}
          {detail.profile?.emergencyContactName && (
            <div className="md:col-span-2">
              <Section title="Emergency Protocol">
                <Row label="Primary Contact" value={`${detail.profile.emergencyContactName} (${detail.profile.emergencyContactNumber || "—"})`} />
              </Section>
            </div>
          )}

          {/* Medical / Chronic conditions */}
          {detail.profile?.hasChronicDisease && (
            <div className="md:col-span-2 p-5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl">
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <Heart size={16} /> Chronic Medical Condition Declared
              </h4>
              <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                {detail.profile?.chronicDiseaseDetails || "Details not provided."}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Internal Layout helpers for UI clean code
const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-100 dark:border-gray-700">
      {title}
    </h4>
    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-100/70 dark:border-gray-700/50 divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
      {children}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center px-4 py-3.5">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-right max-w-[65%] truncate">
      {value}
    </span>
  </div>
);

export default StudentDetail;
