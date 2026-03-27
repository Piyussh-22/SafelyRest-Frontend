import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { googleLoginUser } from "../store/authSlice.js";
import { ROUTES } from "../constants/index.js";
import { useCallback } from "react";

const GoogleBtn = ({ userType = "guest", onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCredentialResponse = useCallback(
    (response) => {
      dispatch(googleLoginUser({ idToken: response.credential, userType }))
        .unwrap()
        .then(() => {
          if (onSuccess) onSuccess();
          else navigate(ROUTES.HOME);
        })
        .catch((err) => console.error("Google login failed:", err));
    },
    [dispatch, navigate, userType, onSuccess],
  );

  useEffect(() => {
    const init = () => {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "continue_with",
        },
      );
    };

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }
  }, [userType, handleCredentialResponse]);

  return <div id="google-btn" className="w-full flex justify-center" />;
};

export default GoogleBtn;
