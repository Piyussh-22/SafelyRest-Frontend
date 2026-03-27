import { configureStore } from "@reduxjs/toolkit";
import authReducer     from "./authSlice.js";
import housesReducer   from "./housesSlice.js";
import favoritesReducer from "./favoritesSlice.js";
import bookingsReducer from "./bookingsSlice.js";
import adminReducer    from "./adminSlice.js";

const store = configureStore({
  reducer: {
    auth:      authReducer,
    houses:    housesReducer,
    favorites: favoritesReducer,
    bookings:  bookingsReducer,
    admin:     adminReducer,
  },
});

export default store;
