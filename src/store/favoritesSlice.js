import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favoritesService from "../services/favoritesService.js";

// ─── Async Thunks ────────────────────────────────────────────────────────────

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.getFavorites();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (houseId, { rejectWithValue }) => {
    try {
      const data = await favoritesService.toggleFavorite(houseId);
      return { houseId, data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites(state) {
      state.items = [];
      state.error = null;
    },
    clearFavoritesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch favorites ──────────────────────────────────────────────────
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.data ?? [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Toggle favorite (FIXED) ──────────────────────────────────────────
      .addCase(toggleFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updatedList = action.payload?.data?.data;
        if (Array.isArray(updatedList)) {
          state.items = updatedList;
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearFavorites, clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
