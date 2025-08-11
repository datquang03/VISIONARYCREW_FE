import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./APIs/slices/authSlice";
import tranSlice from "./APIs/slices/transactionSlice"
import doctorSlice from "./APIs/slices/doctorSlice";
import doctorRegisterSlice from "./APIs/slices/doctorRegisterSlice";
import adminSlice from "./APIs/slices/adminSlice";
import userProfileSlice from "./APIs/slices/userProfileSlice";
import paymentSlice from "./APIs/slices/paymentSlice";
import doctorProfileSlice from "./APIs/slices/doctorProfileSlice";
import globalReducer from './APIs/slices/globalSlice';
import scheduleReducer from "./APIs/slices/scheduleSlice";
import notificationReducer from './APIs/slices/notificationSlice';
import aiReducer from './APIs/slices/aiSlice';
import feedbackReducer from './APIs/slices/feedbackSlice';
import messageReducer from './APIs/slices/messageSlice';
import blogReducer from './APIs/slices/blogSlice';

const store = configureStore({
  reducer: {
    authSlice: authSlice.reducer,
    doctorSlice: doctorSlice.reducer,
    tranSlice: tranSlice.reducer,
    doctorRegisterSlice: doctorRegisterSlice.reducer,
    adminSlice: adminSlice.reducer,
    userProfileSlice: userProfileSlice,
    doctorProfile: doctorProfileSlice.reducer,
    paymentSlice: paymentSlice.reducer,
    global: globalReducer,
    scheduleSlice: scheduleReducer,
    notification: notificationReducer,
    ai: aiReducer,
    feedbackSlice: feedbackReducer,
    messageSlice: messageReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
export { store };
