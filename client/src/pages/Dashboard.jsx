import { useEffect, useState } from "react";
import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { resumesApi } from "../api/resumes.js";
import { uploadsApi } from "../api/uploads.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Dashboard = () => {
  const colors = ["#9933ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];
  const { user } = useAuth();
  const toast = useToast();
  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const createResume = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { resume: created } = await resumesApi.create({ title });
      setShowCreateResume(false);
      setTitle("");
      toast.success("Let's build it out.", "Resume created");
      navigate(`/app/builder/${created._id}`);
    } catch (err) {
      toast.error(err.message, "Could not create resume");
    } finally {
      setBusy(false);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please choose a file to upload.", "No file selected");
      return;
    }
    setBusy(true);
    try {
      const { url } = await uploadsApi.file(resume);
      const { resume: created } = await resumesApi.create({
        title,
        sourceFile: url,
      });
      setShowUploadResume(false);
      setTitle("");
      setResume(null);
      toast.success("Your file was uploaded.", "Resume added");
      navigate(`/app/builder/${created._id}`);
    } catch (err) {
      toast.error(err.message, "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { resume: updated } = await resumesApi.update(editResumeId, { title });
      setAllResumes((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r)),
      );
      setEditResumeId("");
      setTitle("");
      toast.success("Title updated.", "Saved");
    } catch (err) {
      toast.error(err.message, "Could not update title");
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await resumesApi.remove(deleteTarget._id);
      setAllResumes((prev) =>
        prev.filter((resume) => resume._id !== deleteTarget._id),
      );
      toast.success(`"${deleteTarget.title}" was deleted.`, "Done");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message, "Could not delete resume");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    let active = true;
    resumesApi
      .list()
      .then((data) => active && setAllResumes(data.resumes || []))
      .catch((err) => active && toast.error(err.message, "Failed to load resumes"));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || "there"}
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all durration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-green-300 to-green-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-green-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-green-500 hover:shadow-lg transition-all durration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-emerald-300 to-teal-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-teal-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>
        <hr className="border-slate-300 my-6 sm:w-76.25" />
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={resume._id || index}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                    onClick={() => setDeleteTarget(resume)}
                  />
                  <PencilIcon
                    onClick={() => {
                      setEditResumeId(resume._id);
                      setTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
                required
              />
              <button
                disabled={busy}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transiton-colors disabled:opacity-60"
              >
                {busy ? "Creating…" : "Create Resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
                required
              />
              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select resume file
                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="resume-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="hidden"
                />
              </div>
              <button
                disabled={busy}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transiton-colors disabled:opacity-60"
              >
                {busy ? "Uploading…" : "Upload Resume"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                  setResume(null);
                }}
              />
            </div>
          </form>
        )}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 border border-slate-300 rounded focus:border-green-600 focus:ring-1 focus:ring-green-600 outline-none"
                required
              />
              <button
                disabled={busy}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transiton-colors disabled:opacity-60"
              >
                {busy ? "Updating…" : "Update"}
              </button>
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}

        {deleteTarget && (
          <div
            onClick={() => !busy && setDeleteTarget(null)}
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
            >
              <div className="flex flex-col items-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-red-50">
                  <TrashIcon className="size-6 text-red-600" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  Delete resume?
                </h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                  <span className="font-medium text-slate-700">
                    “{deleteTarget.title}”
                  </span>{" "}
                  permanently delete ho jayega. Ye action undo nahi ho sakta.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setDeleteTarget(null)}
                  className="h-11 flex-1 rounded-full border border-slate-200 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={confirmDelete}
                  className="h-11 flex-1 rounded-full bg-red-600 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {busy ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
