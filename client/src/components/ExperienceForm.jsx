import { Briefcase, PlusIcon, Trash2Icon } from "lucide-react";
import AiButton from "./AiButton";

const emptyItem = {
  company: "",
  position: "",
  start_date: "",
  end_date: "",
  description: "",
  is_current: false,
};

const inputClass =
  "mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm";

const ExperienceForm = ({ data = [], onChange }) => {
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
          <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
          <p className="text-sm text-gray-600">Where have you worked?</p>
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
              aria-label="Remove experience"
            >
              <Trash2Icon className="size-4" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Position
                </label>
                <input
                  className={inputClass}
                  value={item.position || ""}
                  onChange={(e) => update(index, "position", e.target.value)}
                  placeholder="Senior Developer"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Company
                </label>
                <input
                  className={inputClass}
                  value={item.company || ""}
                  onChange={(e) => update(index, "company", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Start date
                </label>
                <input
                  type="month"
                  className={inputClass}
                  value={item.start_date || ""}
                  onChange={(e) => update(index, "start_date", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  End date
                </label>
                <input
                  type="month"
                  disabled={item.is_current}
                  className={`${inputClass} disabled:bg-slate-100`}
                  value={item.is_current ? "" : item.end_date || ""}
                  onChange={(e) => update(index, "end_date", e.target.value)}
                />
              </div>
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={item.is_current || false}
                onChange={(e) => update(index, "is_current", e.target.checked)}
              />
              I currently work here
            </label>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <AiButton
                  field="experience"
                  content={item.description || ""}
                  context={{ position: item.position, company: item.company }}
                  onResult={(text) => update(index, "description", text)}
                />
              </div>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={item.description || ""}
                onChange={(e) => update(index, "description", e.target.value)}
                placeholder="What did you accomplish in this role?"
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <Briefcase className="size-4" /> No experience added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExperienceForm;
