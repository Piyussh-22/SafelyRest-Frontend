import authReducer, { logout, clearAuthError } from "../src/store/authSlice.js";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

describe("authSlice reducers", () => {
  it("should return initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toMatchObject({
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it("should handle logout", () => {
    const loggedInState = {
      user: { id: "1", name: "Test" },
      token: "abc123",
      isAuthenticated: true,
      loading: false,
      error: null,
    };
    const state = authReducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("should handle clearAuthError", () => {
    const stateWithError = { ...initialState, error: "Something went wrong" };
    const state = authReducer(stateWithError, clearAuthError());
    expect(state.error).toBeNull();
  });
});
