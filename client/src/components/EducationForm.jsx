import { GraduationCap, PlusIcon, Trash2Icon } from "lucide-react";

const emptyItem = {
  institution: "",
  degree: "",
  field: "",
  graduation_date: "",
  gpa: "",
};

const inputClass =
  "mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm";

const EducationForm = ({ data = [], onChange }) => {
  const update = (index, field, value) => {
    const next = data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange(next);
  };

  const addItem = () => onChange([...data, { ...emptyItem }]);
  const removeItem = (index) => onChange(data.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-600">Your academic background</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="size-4" /> Add
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-gray-200 p-4 pt-8"
          >
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
              aria-label="Remove education"
            >
              <Trash2Icon className="size-4" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Institution
                </label>
                <input
                  className={inputClass}
                  value={item.institution || ""}
                  onChange={(e) => update(index, "institution", e.target.value)}
                  placeholder="University of Example"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Degree
                </label>
                <input
                  className={inputClass}
                  value={item.degree || ""}
                  onChange={(e) => update(index, "degree", e.target.value)}
                  placeholder="B.Sc."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Field of study
                </label>
                <input
                  className={inputClass}
                  value={item.field || ""}
                  onChange={(e) => update(index, "field", e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Graduation date
                </label>
                <input
                  type="month"
                  className={inputClass}
                  value={item.graduation_date || ""}
                  onChange={(e) =>
                    update(index, "graduation_date", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">GPA</label>
                <input
                  className={inputClass}
                  value={item.gpa || ""}
                  onChange={(e) => update(index, "gpa", e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <GraduationCap className="size-4" /> No education added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default EducationForm;
