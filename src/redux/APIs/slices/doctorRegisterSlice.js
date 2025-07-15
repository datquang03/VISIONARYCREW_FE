    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
    import { getRequest, patchRequest } from "../../../services/httpMethods";

    // ===================== THUNKS =====================
    export const getPendingDoctors = createAsyncThunk(
    "DoctorRegister/getPendingDoctors",
    async (_, { rejectWithValue }) => {
        try {
        const response = await getRequest("/doctors/pending");
        return response;
        } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error fetching pending doctors" });
        }
    }
    );

    export const handleDoctorApplication = createAsyncThunk(
    "DoctorRegister/handleDoctorApplication",
    async ({ doctorId, status, rejectionMessage }, { rejectWithValue }) => {
        try {
        const response = await patchRequest("/doctors/handle", {
            doctorId,
            status,
            rejectionMessage,
        });
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error handling doctor application" });
        }
    }
    );

    export const getAllDoctors = createAsyncThunk(
    "DoctorRegister/getAllDoctors",
    async (_, { rejectWithValue }) => {
        try {
        const response = await getRequest("/doctors");
        return response;
        } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error fetching all doctors" });
        }
    }
    );

    export const getDoctorByRegisterId = createAsyncThunk(
    "DoctorRegister/getDoctorByRegisterId",
    async (doctorRegisterId, { rejectWithValue }) => {
        try {
        const response = await getRequest(`/doctors/register/${doctorRegisterId}`);
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || { message: "Error fetching doctor info" });
        }
    }
    );

    const initialState = {
    pendingDoctors: [],
    allDoctors: [],
    totalDoctors: 0,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: null,
    handleApplicationStatus: null,
    handleApplicationMessage: null,

    doctorDetail: null,
    doctorDetailStatus: null,
    doctorDetailMessage: null,
    };

    const doctorRegisterSlice = createSlice({
    name: "doctorRegisterSlice",
    initialState,
    reducers: {
        resetDoctorRegisterState: (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = false;
        state.message = null;
        state.handleApplicationStatus = null;
        state.handleApplicationMessage = null;
        state.allDoctors = [];
        state.totalDoctors = 0;
        state.doctorDetail = null;
        state.doctorDetailStatus = null;
        state.doctorDetailMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPendingDoctors.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.message = null;
        })
        .addCase(getPendingDoctors.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.status === 201 && action.payload?.data?.message) {
            state.isSuccess = true;
            state.isError = false;
            state.pendingDoctors = [];
            state.message = action.payload.data.message;
            } else if (action.payload?.status === 200 && action.payload?.data?.pendingDoctors) {
            state.isSuccess = true;
            state.isError = false;
            state.pendingDoctors = action.payload.data.pendingDoctors;
            state.message = action.payload.data.message || "Fetched pending doctors successfully";
            } else {
            state.isSuccess = false;
            state.isError = true;
            state.pendingDoctors = [];
            state.message = action.payload?.data?.message || "No pending doctors found";
            }
        })
        .addCase(getPendingDoctors.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.pendingDoctors = [];
            state.message = action.payload?.message || "Error fetching pending doctors";
        })

        // ======= handleDoctorApplication =======
        .addCase(handleDoctorApplication.pending, (state) => {
            state.isLoading = true;
            state.handleApplicationStatus = null;
            state.handleApplicationMessage = null;
        })
        .addCase(handleDoctorApplication.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.message) {
            state.handleApplicationStatus = "success";
            state.handleApplicationMessage = action.payload.message;
            state.pendingDoctors = state.pendingDoctors.filter(
                (doctor) => doctor.id !== action.payload.doctorId
            );
            } else {
            state.handleApplicationStatus = "error";
            state.handleApplicationMessage = action.payload?.message || "Failed to handle application";
            }
        })
        .addCase(handleDoctorApplication.rejected, (state, action) => {
            state.isLoading = false;
            state.handleApplicationStatus = "error";
            state.handleApplicationMessage = action.payload?.message || "Error handling doctor application";
        })

        // ======= getAllDoctors =======
        .addCase(getAllDoctors.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.message = null;
        })
        .addCase(getAllDoctors.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data?.doctors) {
            state.isSuccess = true;
            state.isError = false;
            state.allDoctors = action.payload.data.doctors;
            state.totalDoctors = action.payload.data.totalDoctors;
            state.message = action.payload.data.message || "Fetched all doctors successfully";
            } else {
            state.isSuccess = false;
            state.isError = true;
            state.allDoctors = [];
            state.totalDoctors = 0;
            state.message = action.payload?.data?.message || "No doctors found";
            }
        })
        .addCase(getAllDoctors.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.allDoctors = [];
            state.totalDoctors = 0;
            state.message = action.payload?.message || "Error fetching all doctors";
        })

        .addCase(getDoctorByRegisterId.pending, (state) => {
            state.doctorDetailStatus = "loading";
            state.doctorDetailMessage = null;
            state.doctorDetail = null;
        })
        .addCase(getDoctorByRegisterId.fulfilled, (state, action) => {
            state.doctorDetailStatus = "success";
            state.doctorDetail = action.payload;
            state.doctorDetailMessage = action.payload.message || "Fetched doctor detail successfully";
        })
        .addCase(getDoctorByRegisterId.rejected, (state, action) => {
            state.doctorDetailStatus = "error";
            state.doctorDetail = null;
            state.doctorDetailMessage = action.payload?.message || "Error fetching doctor info";
        });
    },
    });

    export const { resetDoctorRegisterState } = doctorRegisterSlice.actions;
    export default doctorRegisterSlice;
