import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import housesReducer from "./housesSlice";
import favoritesReducer from "./favoritesSlice";
import bookingsReducer from "./bookingsSlice";
import adminReducer from "./adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    houses: housesReducer,
    favorites: favoritesReducer,
    bookings: bookingsReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
