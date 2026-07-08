import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ResumePreview from "../components/ResumePreview";
import { resumesApi } from "../api/resumes.js";

const Preview = () => {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    resumesApi
      .getPublic(resumeId)
      .then((data) => {
        if (!active) return;
        setResume(data.resume);
        document.title = data.resume.title || "Resume";
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-slate-600">
        <p className="text-lg font-semibold">Resume unavailable</p>
        <p className="text-sm text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl">
        <ResumePreview
          data={resume}
          template={resume.template}
          accentColor={resume.accent_color}
        />
      </div>
    </div>
  );
};

export default Preview;
