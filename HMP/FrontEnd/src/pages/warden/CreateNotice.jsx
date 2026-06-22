import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { BellPlus, Loader2 } from "lucide-react";
import apiClient from "@/api/axios";
import { useNavigate } from "react-router-dom";

const CreateNotice = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const descriptionValue = watch("description", "");

  const onSubmit = async (data) => {
  try {
    if (!data.description?.trim() && !data.attachment?.[0]) {
      alert("Either a description or an attachment is required.");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();

    formData.append("title", data.title);

    if (data.description?.trim()) {
      formData.append("description", data.description);
    }

    if (data.attachment?.[0]) {
      formData.append("attachment", data.attachment[0]);
    }

    await apiClient.post(
      "/api/v1/warden/notice/createNotice",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Notice issued successfully");
    navigate("/warden/dashboard/notices");
  } catch (error) {
    alert(error.response?.data?.message || "Failed to issue notice");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <BellPlus className="text-purple-600" size={32} />
          Issue Notice
        </h1>

        <p className="text-gray-500 mt-1">
         Create a notice for students of your hostel. You may either write a description, or add an attachment(pdf or image).
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
              Notice Title
            </label>

            <input
              type="text"
              placeholder="Enter notice title"
              maxLength={150}
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
              })}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {errors.title && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
          Description (Optional)
          </label>

         <textarea
          rows={8}
          placeholder="Enter notice details"
          maxLength={2000}
          {...register("description")}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          </div>

          <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">
           Attachment (Optional)
           </label>

          <input
           type="file"
           accept=".pdf,.jpg,.jpeg,.png"
           {...register("attachment")}
           className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 file:mr-4 file:rounded-lg file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-purple-700 file:font-semibold hover:file:bg-purple-200"
          />

         <p className="text-xs text-gray-400 mt-2">
         Supported formats: PDF, JPG, JPEG, PNG
        </p>
        </div>

        {watch("attachment")?.[0] && (
        <div className="mt-2 text-sm text-purple-600 font-medium">
         Selected: {watch("attachment")[0].name}
        </div>
        )}

          {/* CHARACTER COUNT */}
          <div className="text-right text-sm text-gray-400">
            {descriptionValue?.length || 0}/2000 characters
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition w-full"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Issuing Notice...
              </>
            ) : (
              <>
                <BellPlus size={18} />
                Issue Notice
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateNotice;