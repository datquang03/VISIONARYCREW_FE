import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./APIs/slices/authSlice";
import tranSlice from "./APIs/slices/transactionSlice"
import doctorSlice from "./APIs/slices/doctorSlice";
import messageSlice from "./APIs/slices/messageSlice";
import doctorRegisterSlice from "./APIs/slices/doctorRegisterSlice";
import adminSlice from "./APIs/slices/adminSlice";
import userSlice from "./APIs/slices/userProfileSlice";
import paymentSlice from "./APIs/slices/paymentSlice";
import doctorProfileSlice from "./APIs/slices/doctorProfileSlice";
const store = configureStore({
  reducer: {
    authSlice: authSlice.reducer,
    doctorSlice: doctorSlice.reducer,
    tranSlice: tranSlice.reducer,
    messageSlice: messageSlice.reducer,
    doctorRegisterSlice: doctorRegisterSlice.reducer,
    adminSlice: adminSlice.reducer,
    userProfileSlice: userSlice.reducer,
    doctorProfile: doctorProfileSlice.reducer,
    paymentSlice: paymentSlice.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
