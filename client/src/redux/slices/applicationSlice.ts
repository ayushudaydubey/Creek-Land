import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
name: "application",
initialState: {
data: {}
},
reducers: {
setApplicationData: (state, action) => {
state.data = { ...state.data, ...action.payload };
}
}
});

export const { setApplicationData } = applicationSlice.actions;
export default applicationSlice.reducer;
