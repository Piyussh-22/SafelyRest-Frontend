import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../services/authService";

// --- Thunks ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return {
        token: data.token,
        user: {
          _id: data.user.id,
          name: data.user.name,
          userType: data.user.role,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      return {
        token: data.token,
        user: {
          _id: data.user.id,
          name: data.user.name,
          userType: data.user.role,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async (tokenData, { rejectWithValue }) => {
    try {
      const data = await authService.googleLogin(tokenData);
      return {
        token: data.token,
        user: {
          _id: data.user.id,
          name: data.user.name,
          userType: data.user.role,
        },
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- LocalStorage Safe Read ---
let savedUser = null;
let savedToken = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user"));
  savedToken = localStorage.getItem("token");
} catch (e) {
  savedUser = null;
  savedToken = null;
  console.error("authSlice", e);
}

// --- Initial State ---
const initialState = {
  user: savedUser,
  token: savedToken || null,
  isAuthenticated: !!savedUser,
  loading: false,
  error: null,
};

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } catch (e) {
        console.error("authSlice", e);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("token", state.token);
        } catch (e) {
          console.error("authSlice", e);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("token", state.token);
        } catch (e) {
          console.error("authSlice", e);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })

      // Google login
      .addCase(googleLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
        try {
          localStorage.setItem("user", JSON.stringify(state.user));
          localStorage.setItem("token", state.token);
        } catch (e) {
          console.error("authSlice", e);
        }
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
