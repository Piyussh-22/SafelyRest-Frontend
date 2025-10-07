import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { LogIn } from "lucide-react";

const GoogleLoginButton = ({ onLogin, userType }) => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
          userType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onLogin(data.user, data.token);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleLoginError = () => {
    console.error("Google login failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border transition"
        >
          <LogIn className="w-5 h-5" />
          Sign in with Google
        </button>
      )}
    />
  );
};

export default GoogleLoginButton;
