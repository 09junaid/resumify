import { useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDown, PlusIcon } from "lucide-react";

const PRESETS = [
  "#3B82F6", // blue
  "#16A34A", // green
  "#0EA5E9", // sky
  "#14B8A6", // teal
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#EF4444", // red
  "#F59E0B", // amber
  "#0F172A", // slate-900
];

const Swatch = ({ color, selected, children, onClick, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title || color}
    className="relative grid size-8 place-items-center rounded-full border border-black/10 transition-transform hover:scale-110"
    style={{
      backgroundColor: color,
      outline: selected ? `2px solid ${color}` : "2px solid transparent",
      outlineOffset: "2px",
    }}
  >
    {children}
  </button>
);

const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const current = value || "#3B82F6";
  const isCustom = value && !PRESETS.includes(value.toUpperCase());

  // Close the dropdown on outside click.
  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const select = (color) => {
    onChange(color);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative mt-1">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors hover:border-gray-400 focus:border-green-500"
      >
        <span
          className="size-5 shrink-0 rounded-full border border-black/10"
          style={{ backgroundColor: current }}
        />
        <span className="font-medium text-gray-700">{current.toUpperCase()}</span>
        <ChevronDown
          className={`ml-auto size-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute left-0 z-30 mt-2 w-60 rounded-xl border border-gray-200 bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.16)]">
          <p className="mb-2 text-xs font-medium text-gray-400">Preset colors</p>
          <div className="grid grid-cols-5 gap-2.5">
            {PRESETS.map((c) => (
              <Swatch
                key={c}
                color={c}
                selected={value?.toUpperCase() === c}
                onClick={() => select(c)}
              >
                {value?.toUpperCase() === c && (
                  <CheckIcon className="size-4 text-white" strokeWidth={3} />
                )}
              </Swatch>
            ))}

            {/* Custom color */}
            <div className="relative">
              <Swatch
                color={isCustom ? value : "#ffffff"}
                selected={isCustom}
                title="Custom color"
                onClick={() => inputRef.current?.click()}
              >
                {isCustom ? (
                  <CheckIcon className="size-4 text-white" strokeWidth={3} />
                ) : (
                  <PlusIcon className="size-4 text-slate-400" strokeWidth={2.5} />
                )}
              </Swatch>
              <input
                ref={inputRef}
                type="color"
                value={current}
                onChange={(e) => onChange(e.target.value)}
                className="absolute inset-0 size-0 opacity-0"
                aria-label="Pick a custom color"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
