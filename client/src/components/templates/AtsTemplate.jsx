const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const Heading = ({ children }) => (
  <h2 className="mb-1.5 mt-4 border-b border-gray-400 pb-0.5 text-sm font-bold uppercase tracking-wider text-gray-900">
    {children}
  </h2>
);

const AtsTemplate = ({ data, accentColor }) => {
  const info = data.personal_info || {};
  const contactLine = [info.email, info.phone, info.location]
    .filter(Boolean)
    .join("  |  ");

  return (
    <div className="mx-auto max-w-4xl bg-white px-10 py-8 text-[13px] text-gray-800">
      {/* Header */}
      <header className="text-center">
        <h1
          className="text-2xl font-bold uppercase tracking-wide"
          style={{ color: accentColor }}
        >
          {info.full_name || "Your Name"}
        </h1>
        {contactLine && (
          <p className="mt-1 text-xs text-gray-600">{contactLine}</p>
        )}
        {(info.linkedin || info.website) && (
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span className="break-all">{info.linkedin}</span>
            <span className="break-all">{info.website}</span>
          </div>
        )}
      </header>

      {/* Summary */}
      {data.professional_summary && (
        <section>
          <Heading>Summary</Heading>
          <p className="text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <Heading>Skills</Heading>
          <p className="text-gray-700">{data.skills.join(", ")}</p>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section>
          <Heading>Education</Heading>
          <div className="space-y-1.5">
            {data.education.map((edu, index) => (
              <div
                key={index}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="font-semibold text-gray-900">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                  {edu.institution && ` | ${edu.institution}`}
                </span>
                <span className="whitespace-nowrap text-gray-600">
                  {edu.gpa && `CGPA: ${edu.gpa} | `}
                  {formatDate(edu.graduation_date)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section>
          <Heading>Experience</Heading>
          <div className="space-y-2">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-semibold text-gray-900">
                    {exp.position}
                    {exp.company && ` | ${exp.company}`}
                  </span>
                  <span className="whitespace-nowrap text-gray-600">
                    {formatDate(exp.start_date)} -{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-0.5 list-disc pl-5 text-gray-700">
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

      {/* Academic Projects */}
      {data.project && data.project.length > 0 && (
        <section>
          <Heading>Academic Projects</Heading>
          <div className="space-y-1.5">
            {data.project.map((proj, index) => (
              <div key={index}>
                <span className="font-semibold text-gray-900">{proj.name}</span>
                {proj.type && (
                  <span className="text-gray-600"> — {proj.type}</span>
                )}
                {proj.description && (
                  <p className="text-gray-700">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <Heading>Certifications</Heading>
          <ul className="list-disc pl-5 text-gray-700">
            {data.certifications.map((c, index) => (
              <li key={index}>{c}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <section>
          <Heading>Achievements / Hobbies</Heading>
          <ul className="list-disc pl-5 text-gray-700">
            {data.achievements.map((a, index) => (
              <li key={index}>{a}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default AtsTemplate;
