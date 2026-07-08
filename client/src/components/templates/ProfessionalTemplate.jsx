const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const Heading = ({ children, accentColor }) => (
  <h2
    className="mb-3 border-b-2 pb-1 text-lg font-bold uppercase tracking-wide text-gray-900"
    style={{ borderColor: accentColor }}
  >
    {children}
  </h2>
);

const ProfessionalTemplate = ({ data, accentColor }) => {
  return (
    <div className="mx-auto max-w-4xl bg-white p-10 text-gray-800 leading-relaxed">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: accentColor }}>
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          {data.personal_info?.profession && (
            <p className="mt-1 text-sm text-gray-500">
              {data.personal_info.profession}
            </p>
          )}
        </div>
        <div className="text-right text-sm text-gray-600 space-y-0.5">
          {data.personal_info?.email && <p>{data.personal_info.email}</p>}
          {data.personal_info?.phone && <p>{data.personal_info.phone}</p>}
          {data.personal_info?.location && <p>{data.personal_info.location}</p>}
          {data.personal_info?.linkedin && (
            <p className="break-all">{data.personal_info.linkedin}</p>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section className="mb-6">
          <Heading accentColor={accentColor}>Summary</Heading>
          <p className="text-sm text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <Heading accentColor={accentColor}>Skills</Heading>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-700 sm:grid-cols-3">
            {data.skills.map((skill, index) => (
              <span key={index}>• {skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <Heading accentColor={accentColor}>Education</Heading>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                {edu.graduation_date && (
                  <p className="whitespace-nowrap text-sm text-gray-600">
                    Graduated: {formatDate(edu.graduation_date)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <Heading accentColor={accentColor}>Work Experience</Heading>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company}
                      {exp.company && data.personal_info?.location
                        ? `, ${data.personal_info.location}`
                        : ""}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm text-gray-600">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </p>
                </div>
                {exp.description && (
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-700 space-y-0.5">
                    {exp.description.split("\n").map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.project && data.project.length > 0 && (
        <section className="mb-6">
          <Heading accentColor={accentColor}>Projects</Heading>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index}>
                <h3 className="font-bold text-gray-900">{proj.name}</h3>
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
        <section className="mb-6">
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
        <section className="mb-6">
          <Heading accentColor={accentColor}>Achievements</Heading>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {data.achievements.map((a, index) => (
              <li key={index}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
