import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 1,
  personal: {},
  employment: {},
  banking: {},
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    savePersonal: (state, action) => {
      state.personal = action.payload;
    },
    saveEmployment: (state, action) => {
      state.employment = action.payload;
    },
    saveBanking: (state, action) => {
      state.banking = action.payload;
    },
  },
});

export const { setStep, savePersonal, saveEmployment, saveBanking } =
  applicationSlice.actions;

export default applicationSlice.reducer;