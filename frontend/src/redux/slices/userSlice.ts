import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  firstname: string;
  lastname: string;
  email: string;
  isLoggedIn: boolean;
  theme: "light" | "dark";
}

const initialState: UserState = {
  firstname: "",
  lastname: "",
  email: "",
  isLoggedIn: false,
  theme: "light",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        firstname: string;
        lastname: string;
        email: string;
      }>
    ) => {
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },

    initializeUser: (
      state,
      action: PayloadAction<{
        firstname: string;
        lastname: string;
        email: string;
      }>
    ) => {
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },

    logout: () => initialState,

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { login, logout, toggleTheme, initializeUser } =
  userSlice.actions;

export default userSlice.reducer;
