import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeftIcon,
  AwardIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  SaveIcon,
  SparkleIcon,
  TrophyIcon,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import SummaryForm from "../components/SummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectsForm from "../components/ProjectsForm";
import SkillsForm from "../components/SkillsForm";
import ListSectionForm from "../components/ListSectionForm";
import ColorPicker from "../components/ColorPicker";
import ResumePreview from "../components/ResumePreview";
import { resumesApi } from "../api/resumes.js";
import { uploadsApi } from "../api/uploads.js";
import { useToast } from "../context/ToastContext.jsx";

const TEMPLATES = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "minimal-image", label: "Minimal + Image" },
  { id: "professional", label: "Professional" },
  { id: "ats", label: "ATS (plain)" },
  { id: "elegant", label: "Elegant" },
];

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    certifications: [],
    achievements: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const toast = useToast();

  const patch = (partial) => setResumeData((prev) => ({ ...prev, ...partial }));

  const handleSave = async () => {
    setSaving(true);
    try {
      let personalInfo = resumeData.personal_info || {};

      // If a new image File was selected, upload it and store the URL.
      if (personalInfo.image && typeof personalInfo.image === "object") {
        const { url } = await uploadsApi.file(personalInfo.image);
        personalInfo = { ...personalInfo, image: url };
        patch({ personal_info: personalInfo });
      }

      const payload = {
        title: resumeData.title,
        public: resumeData.public,
        template: resumeData.template,
        accent_color: resumeData.accent_color,
        personal_info: personalInfo,
        professional_summary: resumeData.professional_summary,
        skills: resumeData.skills,
        experience: resumeData.experience,
        education: resumeData.education,
        project: resumeData.project,
        certifications: resumeData.certifications,
        achievements: resumeData.achievements,
      };

      const { resume } = await resumesApi.update(resumeId, payload);
      setResumeData(resume);
      toast.success("All your changes are saved.", "Resume saved");
    } catch (err) {
      toast.error(err.message, "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "project", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: SparkleIcon },
    { id: "certifications", name: "Certifications", icon: AwardIcon },
    { id: "achievements", name: "Achievements", icon: TrophyIcon },
  ];
  const activeSection = sections[activeSectionIndex];

  useEffect(() => {
    if (!resumeId) return;
    let active = true;
    resumesApi
      .getOne(resumeId)
      .then((data) => {
        if (!active) return;
        setResumeData(data.resume);
        document.title = data.resume.title || "Resume Builder";
      })
      .catch((err) => active && toast.error(err.message, "Failed to load resume"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading resume…
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
        <Link
          to={"/app"}
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-all"
          >
            <DownloadIcon className="size-4" /> Download
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700 transition-all disabled:opacity-60"
          >
            <SaveIcon className="size-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Title + template + color + visibility controls */}
        <div className="mb-6 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-medium text-gray-500">Title</label>
            <input
              value={resumeData.title || ""}
              onChange={(e) => patch({ title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring focus:ring-green-500"
              placeholder="Resume title"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Template</label>
            <select
              value={resumeData.template || "classic"}
              onChange={(e) => patch({ template: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">
              Accent color
            </label>
            <ColorPicker
              value={resumeData.accent_color || "#3B82F6"}
              onChange={(color) => patch({ accent_color: color })}
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => patch({ public: !resumeData.public })}
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:border-gray-400"
            >
              <span className="text-left">
                <span className="block font-medium text-gray-700">
                  {resumeData.public ? "Public" : "Private"}
                </span>
                <span className="block text-xs text-gray-400">
                  {resumeData.public ? "Anyone with the link" : "Only you"}
                </span>
              </span>
              <span
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  resumeData.public ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block size-4 transform rounded-full bg-white shadow transition-transform ${
                    resumeData.public ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel - Form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />
              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <p className="text-sm font-medium text-gray-700">
                  {activeSection.name}
                </p>
                <div className="flex items-center">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex((prevIndex) =>
                          Math.max(prevIndex - 1, 0),
                        )
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                      disabled={activeSectionIndex === 0}
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.min(prevIndex + 1, sections.length - 1),
                      )
                    }
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && "opacity-50"}`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              {/* Form Content */}
              <div className="space-y-6">
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info || {}}
                    onChange={(data) => patch({ personal_info: data })}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === "summary" && (
                  <SummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => patch({ professional_summary: data })}
                    context={{
                      full_name: resumeData.personal_info?.full_name,
                      profession: resumeData.personal_info?.profession,
                      skills: resumeData.skills,
                    }}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => patch({ experience: data })}
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => patch({ education: data })}
                  />
                )}
                {activeSection.id === "project" && (
                  <ProjectsForm
                    data={resumeData.project}
                    onChange={(data) => patch({ project: data })}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => patch({ skills: data })}
                  />
                )}
                {activeSection.id === "certifications" && (
                  <ListSectionForm
                    title="Certifications"
                    subtitle="Licenses and certifications you've earned"
                    placeholder="e.g. AWS Certified Developer – Associate"
                    icon={AwardIcon}
                    data={resumeData.certifications}
                    onChange={(data) => patch({ certifications: data })}
                  />
                )}
                {activeSection.id === "achievements" && (
                  <ListSectionForm
                    title="Achievements"
                    subtitle="Awards, recognitions, or notable highlights"
                    placeholder="e.g. Winner – National Hackathon 2024"
                    icon={TrophyIcon}
                    data={resumeData.achievements}
                    onChange={(data) => patch({ achievements: data })}
                  />
                )}
              </div>
              <button className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm">Save Changes</button>
            </div>
          </div>
          {/* Right Panel - Resume Preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
