import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import editorReducer from "../slices/editorSlice";
import { CodeBlissApi } from "../api";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        editor: editorReducer,
        [CodeBlissApi.reducerPath]: CodeBlissApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(CodeBlissApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
