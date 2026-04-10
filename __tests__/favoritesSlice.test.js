import favoritesReducer, {
  clearFavorites,
  clearFavoritesError,
} from "../src/store/favoritesSlice.js";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

describe("favoritesSlice reducers", () => {
  it("should return initial state", () => {
    expect(favoritesReducer(undefined, { type: "unknown" })).toMatchObject({
      items: [],
      loading: false,
      error: null,
    });
  });

  it("should handle clearFavorites", () => {
    const state = {
      ...initialState,
      items: [{ _id: "1" }],
      error: "some error",
    };
    const result = favoritesReducer(state, clearFavorites());
    expect(result.items).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("should handle clearFavoritesError", () => {
    const state = { ...initialState, error: "Failed to fetch" };
    const result = favoritesReducer(state, clearFavoritesError());
    expect(result.error).toBeNull();
  });
});
