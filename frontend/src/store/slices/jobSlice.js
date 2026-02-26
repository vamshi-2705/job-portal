import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    jobs: [],
    job: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    page: 1,
    pages: 1,
    total: 0,
};

// Get jobs
export const getJobs = createAsyncThunk(
    'jobs/getAll',
    async (queryParams = '', thunkAPI) => {
        try {
            const response = await axios.get(`/api/jobs?${queryParams}`);
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

// Get user jobs
export const getJob = createAsyncThunk(
    'jobs/get',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`/api/jobs/${id}`);
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

// Create job
export const createJob = createAsyncThunk(
    'jobs/create',
    async (jobData, thunkAPI) => {
        try {
            const response = await axios.post('/api/jobs', jobData, {
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

// Delete job
export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async (id, thunkAPI) => {
        try {
            const response = await axios.delete(`/api/jobs/${id}`, {
                withCredentials: true,
            });
            return id;
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

export const jobSlice = createSlice({
    name: 'job',
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
            .addCase(getJobs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJobs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs = action.payload.jobs;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(getJobs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.job = action.payload;
            })
            .addCase(getJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createJob.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createJob.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.jobs.push(action.payload);
            })
            .addCase(createJob.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = jobSlice.actions;
export default jobSlice.reducer;
