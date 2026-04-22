import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as authService from "../services/authService";
import { setAuthToken } from "../services/api";
import { User, ApiUser, SignupData } from "../types";

const normalizeUser = (apiUser: ApiUser): User => ({
  id: apiUser._id ?? apiUser.id ?? "",
  firstName: apiUser.firstName ?? (apiUser as any).name ?? "",
  email: apiUser.email,
  userType: apiUser.userType ?? (apiUser as any).role ?? "guest",
});

const loadFromStorage = (): { user: User | null; token: string | null } => {
  try {
    return {
      user: JSON.parse(localStorage.getItem("user") ?? "null"),
      token: localStorage.getItem("token"),
    };
  } catch {
    return { user: null, token: null };
  }
};

const saveToStorage = (user: User, token: string) => {
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

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const { user: savedUser, token: savedToken } = loadFromStorage();

if (savedToken) setAuthToken(savedToken);

const initialState: AuthState = {
  user: savedUser ?? null,
  token: savedToken ?? null,
  isAuthenticated: !!savedUser && !!savedToken,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await authService.login(credentials);
      return {
        token: data.token,
        user: normalizeUser(data.user as unknown as ApiUser),
      };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const data = await authService.signup(userData);
      return {
        token: data.token,
        user: normalizeUser(data.user as unknown as ApiUser),
      };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLogin",
  async (
    payload: { credential: string; userType?: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await authService.googleLogin(payload);
      return {
        token: data.token,
        user: normalizeUser(data.user as unknown as ApiUser),
      };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

const handleFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: User; token: string }>,
) => {
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  state.loading = false;
  state.error = null;
  saveToStorage(state.user, state.token);
  setAuthToken(action.payload.token);
};

const handlePending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: AuthState, action: PayloadAction<unknown>) => {
  state.loading = false;
  state.error = action.payload as string;
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
