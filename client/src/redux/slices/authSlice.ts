import { User } from "../../types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signin: (state, action: PayloadAction<User>) => {
            (state.isAuthenticated = true), (state.user = action.payload);
        },
        signout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { signin, signout } = authSlice.actions;

export default authSlice.reducer;
