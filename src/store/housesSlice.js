import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as housesService from "../services/housesService.js";

// ─── Async Thunks ────────────────────────────────────────────────────────────

// Public — store listing with optional filters/pagination
export const fetchHouses = createAsyncThunk(
  "houses/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await housesService.getHouses(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Public — single house details
export const fetchHouseById = createAsyncThunk(
  "houses/fetchById",
  async (houseId, { rejectWithValue }) => {
    try {
      return await housesService.getHouseById(houseId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Host — list own houses
export const fetchHostHouses = createAsyncThunk(
  "houses/fetchHost",
  async (_, { rejectWithValue }) => {
    try {
      return await housesService.getHostHouses();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Host — create a new house listing
export const createHouse = createAsyncThunk(
  "houses/create",
  async ({ formData, onUploadProgress }, { rejectWithValue }) => {
    try {
      return await housesService.createHouse(formData, onUploadProgress);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Host — delete own house
export const deleteHouse = createAsyncThunk(
  "houses/delete",
  async (houseId, { rejectWithValue }) => {
    try {
      await housesService.deleteHouse(houseId);
      return houseId; // Return id so reducer can remove it from state
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Admin — delete any house (reuses same reducer logic)
export const adminDeleteHouse = createAsyncThunk(
  "houses/adminDelete",
  async (houseId, { rejectWithValue }) => {
    try {
      const { adminDeleteHouse: svc } =
        await import("../services/adminService.js");
      await svc(houseId);
      return houseId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────────────────────

const initialState = {
  // Public store listing
  list: [],
  pagination: null, // { total, page, limit, totalPages }

  // Host's own listings
  hostList: [],

  // Currently viewed house detail
  selected: null,

  // Separate loading flags so lists and detail don't interfere
  loading: false, // list / hostList fetches
  detailLoading: false, // fetchHouseById
  actionLoading: false, // create / delete

  error: null,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const housesSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    // Clear selected house when leaving detail page
    clearSelected(state) {
      state.selected = null;
    },
    clearHousesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all houses (public) ────────────────────────────────────────
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, houses: [...], pagination: {...} }
        state.list = action.payload?.houses ?? [];
        state.pagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Fetch house by id ────────────────────────────────────────────────
      .addCase(fetchHouseById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchHouseById.fulfilled, (state, action) => {
        state.detailLoading = false;
        // Backend: { success, data: house }
        state.selected = action.payload?.data ?? null;
      })
      .addCase(fetchHouseById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // ── Fetch host houses ────────────────────────────────────────────────
      .addCase(fetchHostHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostHouses.fulfilled, (state, action) => {
        state.loading = false;
        // Backend: { success, data: [...] }
        state.hostList = action.payload?.data ?? [];
      })
      .addCase(fetchHostHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── Create house ─────────────────────────────────────────────────────
      .addCase(createHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newHouse = action.payload?.data;
        if (newHouse) state.hostList.unshift(newHouse); // prepend to host list
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── Delete house (host) ──────────────────────────────────────────────
      .addCase(deleteHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteHouse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.hostList = state.hostList.filter((h) => h._id !== id);
        state.list = state.list.filter((h) => h._id !== id);
      })
      .addCase(deleteHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // ── Admin delete house ───────────────────────────────────────────────
      .addCase(adminDeleteHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(adminDeleteHouse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const id = action.payload;
        state.list = state.list.filter((h) => h._id !== id);
      })
      .addCase(adminDeleteHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelected, clearHousesError } = housesSlice.actions;
export default housesSlice.reducer;
