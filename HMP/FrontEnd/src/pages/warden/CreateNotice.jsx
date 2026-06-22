// import React, { useState } from "react";
// import { BellPlus, Loader2 } from "lucide-react";
// import apiClient from "@/api/axios";
// import { useNavigate } from "react-router-dom";

// const CreateNotice = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!title.trim() || !description.trim()) {
//       alert("Title and Description are required");
//       return;
//     }

//     try {
//       setSubmitting(true);

//       await apiClient.post("/api/v1/warden/notice/createNotice", {
//         title,
//         description,
//       });

//       alert("Notice issued successfully");

//       navigate("/warden/dashboard/notices");
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//         "Failed to issue notice"
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto animate-in fade-in duration-500">

//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
//           <BellPlus className="text-purple-600" size={32} />
//           Issue Notice
//         </h1>

//         <p className="text-gray-500 mt-1">
//           Create a notice for students of your hostel.
//         </p>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

//         <form onSubmit={handleSubmit} className="space-y-6">

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Notice Title
//             </label>

//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter notice title"
//               maxLength={150}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Description
//             </label>

//             <textarea
//               rows={8}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter notice details"
//               maxLength={2000}
//               className="w-full border border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div className="text-right text-sm text-gray-400">
//             {description.length}/2000 characters
//           </div>

//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
//           >
//             {submitting ? (
//               <>
//                 <Loader2 size={18} className="animate-spin" />
//                 Issuing Notice...
//               </>
//             ) : (
//               <>
//                 <BellPlus size={18} />
//                 Issue Notice
//               </>
//             )}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateNotice;

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
      setSubmitting(true);

      await apiClient.post("/api/v1/warden/notice/createNotice", {
        title: data.title,
        description: data.description,
      });

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
          Create a notice for students of your hostel.
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
              Description
            </label>

            <textarea
              rows={8}
              placeholder="Enter notice details"
              maxLength={2000}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description is too short",
                },
              })}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {errors.description && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* CHARACTER COUNT */}
          <div className="text-right text-sm text-gray-400">
            {descriptionValue.length}/2000 characters
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