import { configureStore } from "@reduxjs/toolkit";
import housesReducer from "./housesSlice.js";
import authReducer from "./authSlice.js";
import favoritesReducer from "./favoritesSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    houses: housesReducer,
    favorites: favoritesReducer,
  },
});

export default store;
