import housesReducer, {
  clearSelected,
  clearHousesError,
} from "../src/store/housesSlice.js";

const initialState = {
  list: [],
  pagination: null,
  hostList: [],
  selected: null,
  loading: false,
  detailLoading: false,
  actionLoading: false,
  error: null,
};

describe("housesSlice reducers", () => {
  it("should return initial state", () => {
    expect(housesReducer(undefined, { type: "unknown" })).toMatchObject({
      list: [],
      selected: null,
      loading: false,
      error: null,
    });
  });

  it("should handle clearSelected", () => {
    const state = {
      ...initialState,
      selected: { _id: "1", name: "Test House" },
    };
    const result = housesReducer(state, clearSelected());
    expect(result.selected).toBeNull();
  });

  it("should handle clearHousesError", () => {
    const state = { ...initialState, error: "Something went wrong" };
    const result = housesReducer(state, clearHousesError());
    expect(result.error).toBeNull();
  });
});
