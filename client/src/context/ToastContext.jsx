import { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

const CONFIG = {
  success: {
    icon: CheckCircle2,
    accent: "#16a34a",
    ring: "bg-green-50 text-green-600",
    bar: "bg-green-500",
  },
  error: {
    icon: XCircle,
    accent: "#dc2626",
    ring: "bg-red-50 text-red-600",
    bar: "bg-red-500",
  },
  info: {
    icon: Info,
    accent: "#0284c7",
    ring: "bg-sky-50 text-sky-600",
    bar: "bg-sky-500",
  },
};

const ToastCard = ({ toast, onClose }) => {
  const cfg = CONFIG[toast.type] || CONFIG.info;
  const Icon = cfg.icon;
  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-2xl border border-slate-100 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.16)] backdrop-blur ${
        toast.leaving ? "toast-leave" : "toast-enter"
      }`}
    >
      <span
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ background: cfg.accent }}
      />
      <div className="flex items-start gap-3 py-4 pl-5 pr-4">
        <span
          className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full ${cfg.ring}`}
        >
          <Icon className="size-5" />
        </span>
        <div className="flex-1 pt-0.5">
          {toast.title && (
            <p className="text-sm font-semibold text-slate-900">
              {toast.title}
            </p>
          )}
          <p className="text-sm leading-5 text-slate-500">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 transition-colors hover:text-slate-500"
          aria-label="Dismiss notification"
        >
          <X className="size-4" />
        </button>
      </div>
      {toast.duration ? (
        <span
          className={`toast-progress absolute bottom-0 left-0 h-0.5 ${cfg.bar}`}
          style={{ animationDuration: `${toast.duration}ms` }}
        />
      ) : null}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    // Remove after the exit animation finishes.
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 250);
  }, []);

  const toast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const api = {
    toast,
    success: (message, title) => toast({ type: "success", message, title }),
    error: (message, title) => toast({ type: "error", message, title }),
    info: (message, title) => toast({ type: "info", message, title }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed right-5 top-5 z-[100] flex w-full max-w-sm flex-col gap-3">
          {toasts.map((t) => (
            <ToastCard key={t.id} toast={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
