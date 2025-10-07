import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favoritesService from "../services/favoritesService.js";

// --- Thunks ---
export const fetchFavorites = createAsyncThunk(
  "favorites/fetch",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await favoritesService.getFavorites(token);
      return res.data; // Extract data array here
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (houseId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const res = await favoritesService.toggleFavorite(houseId, token);
      return res.data; // Extract data array here
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Toggle
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
