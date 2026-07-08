import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { aiApi } from "../api/ai.js";
import { useToast } from "../context/ToastContext.jsx";

/**
 * Small "write with AI" button (Gemini). If the field already has
 * content it enhances it; otherwise it generates a fresh draft.
 */
const AiButton = ({ field, content = "", context = {}, onResult, className = "" }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const run = async () => {
    const task = content && content.trim() ? "enhance" : "generate";
    setLoading(true);
    try {
      const { text } = await aiApi.generate({ task, field, content, context });
      onResult(text);
      toast.success(
        task === "enhance" ? "Text enhanced." : "Draft generated.",
        "Gemini AI",
      );
    } catch (err) {
      toast.error(err.message, "AI unavailable");
    } finally {
      setLoading(false);
    }
  };

  const hasContent = content && content.trim();

  return (
    <button
      type="button"
      onClick={run}
      disabled={loading}
      title={hasContent ? "Enhance with AI" : "Write with AI"}
      className={`inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Sparkles className="size-3.5" />
      )}
      {loading ? "Writing…" : hasContent ? "Enhance" : "AI Write"}
    </button>
  );
};

export default AiButton;
