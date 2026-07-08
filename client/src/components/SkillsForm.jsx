import { useState } from "react";
import { SparkleIcon, XIcon } from "lucide-react";

const SkillsForm = ({ data = [], onChange }) => {
  const [value, setValue] = useState("");

  const addSkill = () => {
    const skill = value.trim();
    if (!skill || data.includes(skill)) {
      setValue("");
      return;
    }
    onChange([...data, skill]);
    setValue("");
  };

  const removeSkill = (skill) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
      <p className="text-sm text-gray-600">
        Add the tools and technologies you know
      </p>

      <div className="space-y-1 mt-5">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <SparkleIcon className="size-4" />
          Add a skill
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React JS"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm"
          />
          <button
            type="button"
            onClick={addSkill}
            className="mt-1 shrink-0 rounded-lg bg-green-600 px-4 text-sm font-medium text-white hover:bg-green-700 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {data.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-sm text-green-700"
          >
            {skill}
            <XIcon
              className="size-4 cursor-pointer hover:text-green-900"
              onClick={() => removeSkill(skill)}
            />
          </span>
        ))}
        {data.length === 0 && (
          <p className="text-sm text-slate-400">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;
