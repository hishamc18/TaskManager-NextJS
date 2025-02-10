import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endPoints";

// Fetch All Tasks
export const fetchTasks = createAsyncThunk("tasks/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get(ENDPOINTS.GET_TASKS);
        console.log(data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
});

// Create Task
export const createTask = createAsyncThunk("tasks/create", async (taskData, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post(ENDPOINTS.CREATE_TASK, taskData);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to create task");
    }
});

// Get Task by ID
export const fetchTaskById = createAsyncThunk("tasks/fetchById", async (taskId, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get(ENDPOINTS.GET_TASK_BY_ID(taskId));
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Task not found");
    }
});

// Update Task
export const updateTask = createAsyncThunk("tasks/update", async ({ taskId, updates }, { rejectWithValue }) => {
    console.log(taskId, updates);
    
    try {
        const { data } = await axiosInstance.put(ENDPOINTS.UPDATE_TASK(taskId), updates);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update task");
    }
});

// Delete Task
export const deleteTask = createAsyncThunk("tasks/delete", async (taskId, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(ENDPOINTS.DELETE_TASK(taskId));
        return taskId; // Return taskId to remove from state
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete task");
    }
});

// Task Slice
const taskSlice = createSlice({
    name: "tasks",
    initialState: { tasks: [], loading: false, error: null },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task.id !== action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task.id === action.payload.id);
                if (index !== -1) state.tasks[index] = action.payload;
            });
    },
});

export default taskSlice.reducer;
