import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../services/authService.js";
import { setAuthToken } from "../services/api.js";

// Normalize the API user shape into a consistent internal shape
const normalizeUser = (apiUser) => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  userType: apiUser.role,
});

const loadFromStorage = () => {
  try {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      token: localStorage.getItem("token"),
    };
  } catch {
    return { user: null, token: null };
  }
};

const saveToStorage = (user, token) => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  } catch {}
};

const clearStorage = () => {
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  } catch {}
};

const { user: savedUser, token: savedToken } = loadFromStorage();

if (savedToken) {
  setAuthToken(savedToken);
}

const initialState = {
  user: savedUser ?? null,
  token: savedToken ?? null,
  isAuthenticated: !!savedUser && !!savedToken,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      return { token: data.token, user: normalizeUser(data.user) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      return { token: data.token, user: normalizeUser(data.user) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.googleLogin(payload);
      return { token: data.token, user: normalizeUser(data.user) };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const handleFulfilled = (state, action) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.loading = false;
  state.error = null;

  saveToStorage(state.user, state.token);
  setAuthToken(action.payload.token);
};
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      clearStorage();
      setAuthToken(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)
      .addCase(signupUser.pending, handlePending)
      .addCase(signupUser.fulfilled, handleFulfilled)
      .addCase(signupUser.rejected, handleRejected)
      .addCase(googleLoginUser.pending, handlePending)
      .addCase(googleLoginUser.fulfilled, handleFulfilled)
      .addCase(googleLoginUser.rejected, handleRejected);
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
