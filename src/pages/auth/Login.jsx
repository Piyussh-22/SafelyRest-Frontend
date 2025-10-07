import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/authSlice";
import GoogleBtn from "../../components/GoogleBtn.jsx";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowPass = () => setShowPass(!showPass);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Dispatch Redux thunk and unwrap promise
      const userData = await dispatch(loginUser({ email, password })).unwrap();

      // Navigate to home after successful login
      navigate("/");
    } catch (err) {
      setError(err || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="w-96">
        <GoogleBtn userType="guest" />
        <div className="flex items-center justify-center my-4">
          <span className="px-2 text-sm text-gray-500">OR</span>
        </div>
      </div>

      <form
        onSubmit={handleLogin}
        className="p-6 shadow-md rounded-md w-96 border"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-1 text-sm font-medium">Password</label>
        <div className="relative mb-3">
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border p-2 w-full"
            required
          />
          <button
            type="button"
            onClick={handleShowPass}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-900"
          >
            {showPass ? <Eye /> : <EyeOff />}
          </button>
        </div>

        <p className="text-center text-sm my-4">
          Does not have an account?{" "}
          <a href="/signup" className="text-red-400 hover:underline">
            Sign Up
          </a>
        </p>

        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 px-4 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
