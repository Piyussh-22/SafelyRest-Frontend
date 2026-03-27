import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as adminService from "../services/adminService.js";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAdminStats();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  stats: null,   // { totalMembers, totalHosts, totalGuests, totalHouses, recentUsers }
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, data: { totalMembers, ... } }
        state.stats = action.payload?.data ?? null;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
