import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { signupUser } from "../../store/authSlice.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import GoogleBtn from "../../components/GoogleBtn.jsx";
import { ROUTES } from "../../constants/index.js";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "guest",
    termsAccepted: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (!form.termsAccepted) return "You must accept the terms to continue.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);
    setLoading(true);
    try {
      await dispatch(signupUser(form)).unwrap();
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="text-2xl font-bold text-blue-600">
            Safely Rest
          </Link>
          <h1 className="text-xl font-semibold mt-3 text-[var(--text)]">
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Start booking or hosting today
          </p>
        </div>

        {/* Google - only for guest */}
        {form.userType === "guest" && <GoogleBtn userType="guest" />}

        {form.userType === "guest" && (
          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400">or with email</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Name + role row */}
          <div className="flex gap-3">
            <Input
              label="First name"
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Piyush"
              required
              containerClassName="flex-1"
            />
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-[var(--text)] opacity-80">
                I am a
              </label>
              <select
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-[var(--bg)] text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="guest">Guest</option>
                <option value="host">Host</option>
              </select>
            </div>
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <label className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={form.termsAccepted}
              onChange={handleChange}
              className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            I agree to the terms and conditions
          </label>

          <Button
            type="submit"
            loading={loading}
            disabled={!form.termsAccepted}
            fullWidth
          >
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
