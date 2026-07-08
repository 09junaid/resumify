import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { FiLinkedin } from "react-icons/fi";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const Heading = ({ children, accentColor }) => (
  <div className="mb-4 flex items-center gap-3">
    <span
      className="h-[3px] w-8 rounded-full"
      style={{ backgroundColor: accentColor }}
    />
    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-800">
      {children}
    </h2>
  </div>
);

const ElegantTemplate = ({ data, accentColor }) => {
  const info = data.personal_info || {};

  return (
    <div className="mx-auto max-w-4xl bg-white text-gray-700">
      {/* Header */}
      <header className="px-10 pt-10 pb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {info.full_name || "Your Name"}
        </h1>
        {info.profession && (
          <p
            className="mt-1 text-sm font-medium uppercase tracking-[0.25em]"
            style={{ color: accentColor }}
          >
            {info.profession}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600">
          {info.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" style={{ color: accentColor }} />
              {info.email}
            </span>
          )}
          {info.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="size-3.5" style={{ color: accentColor }} />
              {info.phone}
            </span>
          )}
          {info.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" style={{ color: accentColor }} />
              {info.location}
            </span>
          )}
          {info.linkedin && (
            <span className="flex items-center gap-1.5 break-all">
              <FiLinkedin className="size-3.5" style={{ color: accentColor }} />
              {info.linkedin}
            </span>
          )}
          {info.website && (
            <span className="flex items-center gap-1.5 break-all">
              <Globe className="size-3.5" style={{ color: accentColor }} />
              {info.website}
            </span>
          )}
        </div>
      </header>

      <div
        className="h-1"
        style={{
          background: `linear-gradient(to right, ${accentColor}, ${accentColor}00)`,
        }}
      />

      <div className="px-10 py-8">
        {/* Summary */}
        {data.professional_summary && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Summary</Heading>
            <p className="text-sm leading-relaxed text-gray-700">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Skills</Heading>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${accentColor}15`,
                    color: accentColor,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Education</Heading>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    {edu.gpa && (
                      <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="whitespace-nowrap text-sm text-gray-500">
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Experience</Heading>
            <div className="space-y-5">
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-5"
                  style={{ borderLeft: `2px solid ${accentColor}30` }}
                >
                  <span
                    className="absolute -left-[5px] top-1.5 size-2 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p
                        className="text-sm font-medium"
                        style={{ color: accentColor }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm text-gray-500">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project && data.project.length > 0 && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Projects</Heading>
            <div className="space-y-3">
              {data.project.map((proj, index) => (
                <div key={index}>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                    {proj.type && (
                      <span className="text-xs text-gray-500">{proj.type}</span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-sm text-gray-700">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section className="mb-7">
            <Heading accentColor={accentColor}>Certifications</Heading>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {data.certifications.map((c, index) => (
                <li key={index}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Achievements */}
        {data.achievements && data.achievements.length > 0 && (
          <section>
            <Heading accentColor={accentColor}>Achievements</Heading>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {data.achievements.map((a, index) => (
                <li key={index}>{a}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ElegantTemplate;
