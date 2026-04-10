import bookingsReducer, {
  clearBookingError,
} from "../src/store/bookingsSlice.js";

const initialState = {
  myBookings: [],
  hostBookings: [],
  adminBookings: [],
  adminPagination: null,
  loading: false,
  actionLoading: false,
  error: null,
};

describe("bookingsSlice reducers", () => {
  it("should return initial state", () => {
    expect(bookingsReducer(undefined, { type: "unknown" })).toMatchObject({
      myBookings: [],
      hostBookings: [],
      loading: false,
      error: null,
    });
  });

  it("should handle clearBookingError", () => {
    const state = { ...initialState, error: "Booking failed" };
    const result = bookingsReducer(state, clearBookingError());
    expect(result.error).toBeNull();
  });
});
