import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as housesService from "../services/housesService";
import { House, Pagination } from "../types";

interface HousesState {
  list: House[];
  pagination: Pagination | null;
  hostList: House[];
  selected: House | null;
  loading: boolean;
  detailLoading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: HousesState = {
  list: [],
  pagination: null,
  hostList: [],
  selected: null,
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,
};

export const fetchHouses = createAsyncThunk(
  "houses/fetchAll",
  async (params: Record<string, unknown> = {}, { rejectWithValue }) => {
    try {
      return await housesService.getHouses(params);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const fetchHouseById = createAsyncThunk(
  "houses/fetchById",
  async (houseId: string, { rejectWithValue }) => {
    try {
      return await housesService.getHouseById(houseId);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const fetchHostHouses = createAsyncThunk(
  "houses/fetchHost",
  async (_, { rejectWithValue }) => {
    try {
      return await housesService.getHostHouses();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const createHouse = createAsyncThunk(
  "houses/create",
  async (
    {
      formData,
      onUploadProgress,
    }: { formData: FormData; onUploadProgress?: (percent: number) => void },
    { rejectWithValue },
  ) => {
    try {
      return await housesService.createHouse(formData, onUploadProgress);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const deleteHouse = createAsyncThunk(
  "houses/delete",
  async (houseId: string, { rejectWithValue }) => {
    try {
      await housesService.deleteHouse(houseId);
      return houseId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const adminDeleteHouse = createAsyncThunk(
  "houses/adminDelete",
  async (houseId: string, { rejectWithValue }) => {
    try {
      const { adminDeleteHouse: svc } =
        await import("../services/adminService");
      await svc(houseId);
      return houseId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

const housesSlice = createSlice({
  name: "houses",
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
    clearHousesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload ?? [];
        state.pagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchHouseById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchHouseById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selected = action.payload?.data ?? null;
      })
      .addCase(fetchHouseById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchHostHouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostHouses.fulfilled, (state, action) => {
        state.loading = false;
        state.hostList = action.payload?.data ?? [];
      })
      .addCase(fetchHostHouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createHouse.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newHouse = action.payload?.data;
        if (newHouse) state.hostList.unshift(newHouse);
      })
      .addCase(createHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(
        deleteHouse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionLoading = false;
          state.hostList = state.hostList.filter(
            (h) => h._id !== action.payload,
          );
          state.list = state.list.filter((h) => h._id !== action.payload);
        },
      )
      .addCase(deleteHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })

      .addCase(adminDeleteHouse.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(
        adminDeleteHouse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.actionLoading = false;
          state.list = state.list.filter((h) => h._id !== action.payload);
        },
      )
      .addCase(adminDeleteHouse.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelected, clearHousesError } = housesSlice.actions;
export default housesSlice.reducer;
