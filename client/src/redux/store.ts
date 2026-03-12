import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./slices/applicationSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
reducer: {
application: applicationReducer,
auth: authReducer
}
});
