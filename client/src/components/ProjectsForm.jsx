import { FolderIcon, PlusIcon, Trash2Icon } from "lucide-react";
import AiButton from "./AiButton";

const emptyItem = { name: "", type: "", description: "" };

const inputClass =
  "mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm";

const ProjectsForm = ({ data = [], onChange }) => {
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
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-sm text-gray-600">Showcase what you have built</p>
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
              aria-label="Remove project"
            >
              <Trash2Icon className="size-4" />
            </button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Project name
                </label>
                <input
                  className={inputClass}
                  value={item.name || ""}
                  onChange={(e) => update(index, "name", e.target.value)}
                  placeholder="Task Manager App"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Type
                </label>
                <input
                  className={inputClass}
                  value={item.type || ""}
                  onChange={(e) => update(index, "type", e.target.value)}
                  placeholder="Web Application"
                />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-600">
                  Description
                </label>
                <AiButton
                  field="project"
                  content={item.description || ""}
                  context={{ name: item.name, type: item.type }}
                  onResult={(text) => update(index, "description", text)}
                />
              </div>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                value={item.description || ""}
                onChange={(e) => update(index, "description", e.target.value)}
                placeholder="What does this project do?"
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-slate-400">
            <FolderIcon className="size-4" /> No projects added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectsForm;
