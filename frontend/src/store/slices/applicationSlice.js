import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    applications: [],
    jobApplicants: [],
    savedJobs: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Apply for job
export const applyForJob = createAsyncThunk(
    'applications/apply',
    async (jobId, thunkAPI) => {
        try {
            const response = await axios.post(`/api/applications/${jobId}/apply`, {}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get my applications
export const getMyApplications = createAsyncThunk(
    'applications/getMine',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/applications/me');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get job applicants (for recruiter)
export const getJobApplicants = createAsyncThunk(
    'applications/getJobApplicants',
    async (jobId, thunkAPI) => {
        try {
            const response = await axios.get(`/api/applications/${jobId}/applicants`);
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Save job
export const saveJob = createAsyncThunk(
    'applications/saveJob',
    async (jobId, thunkAPI) => {
        try {
            const response = await axios.post(`/api/applications/${jobId}/save`, {}, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get saved jobs
export const getSavedJobs = createAsyncThunk(
    'applications/getSavedJobs',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/applications/saved');
            return response.data;
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Withdraw application
export const withdrawApplication = createAsyncThunk(
    'applications/withdraw',
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/applications/${id}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Remove saved job
export const removeSavedJob = createAsyncThunk(
    'applications/removeSaved',
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/applications/saved/${id}`, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
    'applications/updateStatus',
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await axios.put(`/api/applications/${id}/status`, { status }, {
                withCredentials: true,
            });
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const applicationSlice = createSlice({
    name: 'application',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(applyForJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(applyForJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications.push(action.payload);
            })
            .addCase(applyForJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyApplications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.applications = action.payload;
            })
            .addCase(getMyApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getJobApplicants.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJobApplicants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobApplicants = action.payload;
            })
            .addCase(getJobApplicants.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(saveJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.savedJobs.push(action.payload);
            })
            .addCase(saveJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSavedJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSavedJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.savedJobs = action.payload;
            })
            .addCase(getSavedJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
