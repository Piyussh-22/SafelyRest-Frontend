import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingsService from "../services/bookingsService.js";

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await bookingsService.createBooking(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingsService.getMyBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await bookingsService.cancelBooking(bookingId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchHostBookings = createAsyncThunk(
  "bookings/fetchHost",
  async (_, { rejectWithValue }) => {
    try {
      return await bookingsService.getHostBookings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateStatus",
  async ({ bookingId, status }, { rejectWithValue }) => {
    try {
      return await bookingsService.updateBookingStatus(bookingId, status);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      return await bookingsService.getAllBookings(params);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  myBookings: [],
  hostBookings: [],
  adminBookings: [],
  adminPagination: null,
  loading: false,
  actionLoading: false, // for confirm/reject/cancel so list doesn't flash
  error: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // My bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = action.payload?.data ?? [];
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel
      .addCase(cancelBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload?.data;

        if (updated) {
          state.myBookings = state.myBookings.map((b) =>
            b._id === updated._id ? { ...b, status: updated.status } : b,
          );
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Host bookings
      .addCase(fetchHostBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.hostBookings = action.payload?.data ?? [];
      })
      .addCase(fetchHostBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status (confirm / reject)
      .addCase(updateBookingStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload?.data;
        if (updated) {
          state.hostBookings = state.hostBookings.map((b) =>
            b._id === updated._id ? updated : b,
          );
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Admin all bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBookings = action.payload?.bookings ?? [];
        state.adminPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
