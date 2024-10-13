// import { createSlice } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { persistReducer } from 'redux-persist';
// import { createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// const initialState = {
//     user: {},
//     spoonacularUsername: '',
//     spoonacularPassword: '',
//     hash: '',
//     isLoggedIn: false,
//     error: null,
//     loading: false,
// };

// export const registerUser = createAsyncThunk(
//     'user/register',
//     async (userData, { dispatch, rejectWithValue }) => {
//         try {
//             const response = await axios.post('https://api.spoonacular.com/users/connect', {

//             });

//             return {
//                 ...userData,
//                 spoonacularUsername: response.data.username,
//                 spoonacularPassword: response.data.spoonacularPassword,
//                 hash: response.data.hash,
//             };
//         } catch (error) {
//             return rejectWithValue(error.response?.data?.message || 'Registration failed');
//         }
//     }
// );

// export const loginUser = createAsyncThunk(
//     'user/login',
//     async (credentials, { dispatch, rejectWithValue }) => {

//     }
// );

// export const logoutUser = createAsyncThunk(
//     'user/logout',
//     async (_, { dispatch }) => {
//         try {
//             dispatch(logoutSuccess()); // Clear the user state
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     }
// );

// // Create the user slice
// const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//         // Successful registration reducer
//         registerSuccess: (state, action) => {
    
//             state.spoonacularUsername = action.payload.spoonacularUsername;
//             state.spoonacularPassword = action.payload.spoonacularPassword;
//             state.hash = action.payload.hash;
//             state.isLoggedIn = true;
//             state.error = null;
//         },
//         // Successful login reducer
//         loginSuccess: (state, action) => {
//             state.isLoggedIn = true;
//             state.error = null;
//         },
//         // Successful logout reducer
//         logoutSuccess: (state) => {
          
//             state.spoonacularUsername = '';
//             state.spoonacularPassword = '';
//             state.hash = '';
//         },
//         // Authentication error reducer
//         authFailed: (state, action) => {
//             state.error = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Handle register thunk
//             .addCase(registerUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(registerUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 userSlice.caseReducers.registerSuccess(state, action);
//             })
//             .addCase(registerUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             })
//             // Handle login thunk
//             .addCase(loginUser.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.loading = false;
//                 userSlice.caseReducers.loginSuccess(state, action);
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// // Export the actions for usage in components
// export const { registerSuccess, loginSuccess, logoutSuccess, authFailed } = userSlice.actions;

// // Persist configuration to store user data
// const persistConfig = {
//     key: 'user',
//     storage: AsyncStorage,
//     whitelist: [], // Persist relevant fields
// };

// // Persisted user reducer
// const persistedUserReducer = persistReducer(persistConfig, userSlice.reducer);

// // Export the reducer to include in the store
// export default persistedUserReducer;
