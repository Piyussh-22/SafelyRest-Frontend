import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as favoritesService from "../services/favoritesService";
import { House } from "../types";

interface FavoritesState {
  items: (House & { isFav: boolean })[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await favoritesService.getFavorites();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggle",
  async (houseId: string, { rejectWithValue }) => {
    try {
      const data = await favoritesService.toggleFavorite(houseId);
      return { houseId, data };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

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
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        console.log("payload:", action.payload);
        state.items = action.payload?.data ?? [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

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
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites, clearFavoritesError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
