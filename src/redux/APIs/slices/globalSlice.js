import { createSlice } from '@reduxjs/toolkit';

const globalSlice = createSlice({
  name: 'global',
  initialState: {
    loading: false,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = globalSlice.actions;
export default globalSlice.reducer; 