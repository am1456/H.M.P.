import React, { useEffect, useState } from "react";
import { Bell, Calendar, User, Plus, Trash2, Paperclip, ExternalLink } from "lucide-react";
import apiClient from "@/api/axios";
import { useNavigate } from "react-router-dom";



const WardenNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchNotices = async () => {
    try {
      const res = await apiClient.get("/api/v1/warden/notice/viewNotices");
      setNotices(res.data.data);
    } catch (error) {
      console.error("Failed to fetch notices", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotice = async (noticeId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this notice?"
  );

  if (!confirmed) return;

  try {
    setDeletingId(noticeId);

    await apiClient.delete(
      `/api/v1/warden/notice/deleteNotice/${noticeId}`
    );

    setNotices((prevNotices) =>
      prevNotices.filter((notice) => notice._id !== noticeId)
    );

    alert("Notice deleted successfully");
  } catch (error) {
    console.error("Failed to delete notice", error);

    alert(
      error?.response?.data?.message ||
      "Failed to delete notice"
    );
  } finally {
    setDeletingId(null);
  }
};

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-blue-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mr-2"></div>
        Loading Notices...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

  <div>
    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
      Hostel Notices
    </h1>

    <p className="text-gray-500 mt-1">
      Manage hostel announcements.
    </p>
  </div>

  <button
    onClick={() => navigate("/warden/dashboard/notices/create")}
    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg"
  >
    <Plus size={18} />
    Issue Notice
  </button>

</div>

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
          {notices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start gap-4 mb-3">

  <h2 className="text-xl font-bold text-gray-800">
    {notice.title}
  </h2>

  <div className="flex items-center gap-3">

    <div className="flex items-center text-xs text-gray-400">
      <Calendar size={12} className="mr-1" />
      {new Date(notice.createdAt).toLocaleDateString("en-GB")}
    </div>

    <button
      onClick={() => handleDeleteNotice(notice._id)}
      disabled={deletingId === notice._id}
      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      title="Delete Notice"
    >
      <Trash2 size={18} />
    </button>
   </div>
  </div>
    <div className="space-y-4">

  {notice.description && (
    <p className="text-gray-600 leading-relaxed">
      {notice.description}
    </p>
  )}

  {notice.attachmentUrl && (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
      <div className="flex items-center justify-between flex-wrap gap-3">

        <div className="flex items-center gap-2 text-purple-700">
          <Paperclip size={16} />
          <span className="font-medium text-sm">
            Attachment Available
          </span>
        </div>

        <a
          href={notice.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
        >
          <ExternalLink size={14} />
          View Attachment
        </a>

      </div>
    </div>
  )}

  <div className="flex items-center text-sm text-gray-500">
    <User size={14} className="mr-2" />
    Issued by: {notice.issuedBy?.fullName}
  </div>

</div>
      </div>
    ))}
    </div>
    )}
    </div>
  );
};

export default WardenNotices;