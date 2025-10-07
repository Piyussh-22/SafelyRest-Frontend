import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLoginUser } from "../redux/authSlice"; // ✅ correct import

const GoogleBtn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = (response) => {
    const idToken = response.credential;

    // Dispatch thunk directly — it will handle redux + localStorage
    dispatch(googleLoginUser({ idToken, userType: "guest" }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.error("Google login failed", err);
      });
  };

  useEffect(() => {
    /* global google */
    const initializeGoogle = () => {
      if (window.google) {
        console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLogin,
        });

        google.accounts.id.renderButton(
          document.getElementById("google-login-btn"),
          { theme: "outline", size: "large", width: "250" }
        );
      }
    };

    if (!document.getElementById("google-login-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = "google-login-script";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }
  }, []);

  return <div id="google-login-btn" className="flex justify-center mt-2"></div>;
};

export default GoogleBtn;
