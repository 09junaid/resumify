import { Link, useNavigate } from "react-router";
import resume from "../../assets/png/resume.jpg";
import logo from "../../assets/svgs/resumify.svg";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const LoginForm = () => {
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [authMode, setAuthMode] = useState(urlState || "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const next = {};
    if (authMode === "signup" && formData.name.trim().length < 2) {
      next.name = "Please enter your full name.";
    }
    if (!EMAIL_RE.test(formData.email)) {
      next.email = "Enter a valid email address.";
    }
    if (formData.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (authMode === "login") {
        const user = await login({
          email: formData.email,
          password: formData.password,
        });
        toast.success(`Welcome back, ${user.name}!`, "Signed in");
      } else {
        const user = await register(formData);
        toast.success(`Your account is ready, ${user.name}.`, "Account created");
      }
      navigate("/app");
    } catch (err) {
      toast.error(
        err.message || "Something went wrong. Please try again.",
        authMode === "login" ? "Login failed" : "Registration failed",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as the user corrects it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  // Shared wrapper styling; turns red when the field has an error.
  const fieldWrap = (field) =>
    `flex h-12 items-center gap-3 rounded-full border px-5 transition focus-within:border-green-400 focus-within:bg-white ${
      errors[field]
        ? "border-red-300 bg-red-50"
        : "border-slate-200 bg-slate-50"
    }`;

  const switchMode = () => {
    setAuthMode((prev) => (prev === "login" ? "signup" : "login"));
    setErrors({});
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 py-10 md:px-12 lg:px-20">
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-green-200/60 blur-3xl md:h-96 md:w-96" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-green-100 bg-white shadow-[0_30px_80px_rgba(22,163,74,0.12)]">
        <div className="relative hidden w-full overflow-hidden bg-green-50 md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-transparent to-green-200/40" />
          <img
            className="h-full w-full object-cover"
            src={resume}
            alt="Resume preview"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent p-8 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-green-200">
              Resumify
            </p>
            <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
              Build a standout resume with the same clean style you saw on the
              home page.
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/80">
              Sign in to access your saved resumes, edit content faster, and
              keep every application polished.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 md:px-12">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="Resumify logo" className="h-10 w-auto" />
            </Link>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div>
                <p className="text-sm font-medium text-green-600">
                  {authMode === "login"
                    ? "Welcome back"
                    : "Create your account"}
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-slate-900">
                  {authMode === "login" ? "Login" : "Sign Up"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {authMode === "login"
                    ? "Continue building professional resumes with a clean, modern workflow."
                    : "Start building professional resumes with a clean, modern workflow."}
                </p>
              </div>

              <div className="my-8 flex items-center justify-center gap-4">
                <div className="h-px w-full bg-slate-200" />
                <p className="shrink-0 text-center text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  {authMode === "login"
                    ? "Sign in with email"
                    : "Sign up with email"}
                </p>
                <div className="h-px w-full bg-slate-200" />
              </div>

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
                noValidate
              >
                {authMode === "signup" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Full name
                    </label>
                    <div className={fieldWrap("name")}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          fill="#64748B"
                        />
                        <path
                          d="M12 14C7.58172 14 4 16.6863 4 20V21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21V20C20 16.6863 16.4183 14 12 14Z"
                          fill="#64748B"
                        />
                      </svg>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="h-full w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 pl-5 text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>
                  <div className={fieldWrap("email")}>
                    <svg
                      width="16"
                      height="11"
                      viewBox="0 0 16 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                        fill="#64748B"
                      />
                    </svg>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-full w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 pl-5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>
                  <div className={fieldWrap("password")}>
                    <svg
                      width="13"
                      height="17"
                      viewBox="0 0 13 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                        fill="#64748B"
                      />
                    </svg>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-full w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 pl-5 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-full bg-green-500 text-sm font-medium text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Please wait…"
                    : authMode === "login"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                {authMode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  className="font-medium text-green-600 hover:underline"
                  onClick={switchMode}
                >
                  {authMode === "login" ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
