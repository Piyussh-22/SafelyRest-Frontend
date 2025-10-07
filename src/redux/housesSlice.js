import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as housesService from "../services/housesService.js";

// --- Thunks ---
// Get all houses (public)
export const fetchHouses = createAsyncThunk(
  "houses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await housesService.getHouses();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get house by ID (public)
export const fetchHouseById = createAsyncThunk(
  "houses/fetchById",
  async (houseId, { rejectWithValue }) => {
    try {
      const data = await housesService.getHouseDetails(houseId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Get host houses (token-aware)
export const fetchHostHouses = createAsyncThunk(
  "houses/fetchHost",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const data = await housesService.getHostHouses(token);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Create house (host only)
export const createHouse = createAsyncThunk(
  "houses/create",
  async ({ formData, onUploadProgress }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const data = await housesService.addHouse(
        formData,
        token,
        onUploadProgress
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete house (host only)
export const deleteHouse = createAsyncThunk(
  "houses/delete",
  async (houseId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      await housesService.deleteHouse(houseId, token);
      return houseId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Initial State ---
const initialState = {
  list: [],
  hostList: [],
  selected: null,
  loading: false,
  error: null,
};

// --- Slice ---
const housesSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all (public)
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Store only the array of houses
        state.list = action.payload?.data || [];
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchHouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload?.data || null;
      })
      .addCase(fetchHouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Host houses
      .addCase(fetchHostHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostHouses.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Only store the array of host houses
        state.hostList = action.payload?.data || [];
      })
      .addCase(fetchHostHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create house
      .addCase(createHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ action.payload is already the created house object
        state.hostList.push(action.payload?.data || action.payload);
        state.list.push(action.payload?.data || action.payload);
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete house
      .addCase(deleteHouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHouse.fulfilled, (state, action) => {
        state.loading = false;
        state.hostList = state.hostList.filter((h) => h._id !== action.payload);
        state.list = state.list.filter((h) => h._id !== action.payload);
      })
      .addCase(deleteHouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelected } = housesSlice.actions;
export default housesSlice.reducer;
