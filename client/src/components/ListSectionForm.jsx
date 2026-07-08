import { useState } from "react";
import { PlusIcon, Trash2Icon } from "lucide-react";

/**
 * Generic editor for a list of short text entries
 * (e.g. certifications, achievements). Add via button/Enter,
 * remove per row, and edit inline.
 */
const ListSectionForm = ({
  title,
  subtitle,
  placeholder = "Add an entry",
  icon: Icon,
  data = [],
  onChange,
}) => {
  const [value, setValue] = useState("");

  const add = () => {
    const v = value.trim();
    if (!v) return;
    onChange([...data, v]);
    setValue("");
  };

  const update = (index, v) =>
    onChange(data.map((item, i) => (i === index ? v : item)));

  const remove = (index) => onChange(data.filter((_, i) => i !== index));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-gray-500" />}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <PlusIcon className="size-4" /> Add
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <input
              value={item}
              onChange={(e) => update(index, e.target.value)}
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-slate-400 hover:text-red-600 transition-colors"
              aria-label="Remove entry"
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-slate-400">Nothing added yet.</p>
        )}
      </div>
    </div>
  );
};

export default ListSectionForm;
