import { FileText } from "lucide-react";
import AiButton from "./AiButton";

const SummaryForm = ({ data, onChange, context = {} }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Professional Summary
      </h3>
      <p className="text-sm text-gray-600">
        A compelling 2–3 line pitch that opens your resume and hooks the reader
      </p>

      <div className="space-y-1 mt-5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FileText className="size-4" />
            Summary
          </label>
          <AiButton
            field="summary"
            content={data}
            context={context}
            onResult={(text) => onChange(text)}
          />
        </div>
        <textarea
          rows={6}
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Results-driven Software Engineer with 4+ years of experience designing, building, and shipping scalable web applications. Adept at transforming complex problems into clean, reliable solutions and collaborating across teams to deliver measurable business impact. Passionate about writing maintainable code and continuously raising the bar on quality."
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm resize-y"
        />
      </div>
    </div>
  );
};

export default SummaryForm;
