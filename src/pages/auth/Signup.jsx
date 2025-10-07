import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../../redux/authSlice";
import GoogleBtn from "../../components/GoogleBtn.jsx";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "guest",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (!formData.termsAccepted) return setError("You must accept the terms");

    setLoading(true);
    try {
      await dispatch(signupUser(formData)).unwrap();
      navigate("/");
    } catch (err) {
      setError(err || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center px-4 py-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-96">
        <GoogleBtn userType="guest" />
        <div className="flex items-center justify-center my-4">
          <span className="px-2 text-sm text-gray-500">OR</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6 border dark:border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center">Create Account</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="flex-1 border rounded-lg px-4 py-2"
            required
          />
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="flex-1 border rounded-lg px-1 py-2"
          >
            <option value="guest">Guest</option>
            <option value="host">Host</option>
          </select>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />

        <label className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
          />
          <span>I agree to the terms and conditions</span>
        </label>

        <button
          type="submit"
          disabled={!formData.termsAccepted || loading}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-red-400 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
