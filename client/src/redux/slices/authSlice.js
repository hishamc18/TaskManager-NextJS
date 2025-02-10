import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import ENDPOINTS from "@/api/endPoints";

// Get Logged-in User
export const fetchLoggedInUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_LOGGED_IN_USER);    
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// Get All users
export const fetchAllUsers = createAsyncThunk("auth/fetchAllUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get(ENDPOINTS.GET_ALLUSERS);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// Login
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(ENDPOINTS.LOGIN, userData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Invalid credentials");
  }
});

// Register
export const registerUser = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post(ENDPOINTS.REGISTER, userData);
    console.log(data);
    
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Registration failed");
  }
});

// Logout
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post(ENDPOINTS.LOGOUT);
    return null; // Clear user state
  } catch (error) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});

// Delete User (Admin Only)
export const deleteUser = createAsyncThunk("auth/deleteUser", async (userId, { rejectWithValue }) => {  
  try {
    await axiosInstance.patch(ENDPOINTS.DELETE_USER(userId));
    return userId;
  } catch (error) {
    console.log(error);
    
    return rejectWithValue(error.response?.data || "Failed to delete user");
  }
});

// Promote User to Admin (Admin Only)
export const promoteUser = createAsyncThunk("auth/promoteUser", async (userId, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.patch(ENDPOINTS.PROMOTE_USER(userId));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to promote user");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { users: [], user: null, loading: false, error: null },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload) {
          state.user = null;
        }
      });
  },
});

export default authSlice.reducer;
