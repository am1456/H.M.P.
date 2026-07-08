import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  User,
  Paperclip,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import apiClient from "@/api/axios";

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await apiClient.get("/api/v1/student/notice/viewNotices");
      setNotices(res.data.data);
    } catch (error) {
      console.error("Failed to fetch notices", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark all notices as read when the page is opened
  const markAllAsRead = async () => {
    try {
      await apiClient.patch("/api/v1/student/notice/markRead");
    } catch (error) {
      console.error("Failed to mark notices as read", error);
    }
  };

  useEffect(() => {
    fetchNotices();
    markAllAsRead(); // fire-and-forget — no need to await
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-emerald-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600 mr-3"></div>
        Loading Notices...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Hostel Notices
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with important hostel announcements.
          </p>
        </div>

        {/* All-read indicator */}
        {notices.length > 0 && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-2 rounded-xl border border-emerald-100">
            <CheckCheck size={16} />
            All caught up
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {notices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-600">
            No Notices Available
          </h3>
          <p className="text-gray-400 text-sm">
            There are currently no active notices.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notices.map((notice, index) => (
            <div
              key={notice._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              {/* Title + Date */}
              <div className="flex justify-between items-start gap-4 mb-3">
                <h2 className="text-xl font-bold text-gray-800">
                  {notice.title}
                </h2>
                <div className="flex items-center text-xs text-gray-400 whitespace-nowrap shrink-0">
                  <Calendar size={12} className="mr-1" />
                  {new Date(notice.createdAt).toLocaleDateString("en-GB")}
                </div>
              </div>

              {/* Description */}
              {notice.description && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {notice.description}
                </p>
              )}

              {/* Attachment */}
              {notice.attachmentUrl && (
                <div className="mb-4">
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition"
                  >
                    <Paperclip size={16} />
                    View Attachment
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {/* Issued By */}
              <div className="flex items-center text-sm text-gray-500">
                <User size={14} className="mr-2" />
                Issued by: {notice.issuedBy?.fullName}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotices;