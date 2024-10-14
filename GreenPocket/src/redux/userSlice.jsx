import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spoonacularAPIKey } from '../config/appSettings';
export const connectUserToSpoonacular = createAsyncThunk(
    'user/connectToSpoonacular',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`https://api.spoonacular.com/users/connect?apiKey=${spoonacularAPIKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                }),
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to connect to Spoonacular');
            }

            return result; 
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const generateMealPlan = createAsyncThunk(
    'user/generateMealPlan',
    async (params, { getState, rejectWithValue }) => {
        const { spoonacularUsername, spoonacularHash } = getState().user;
        console.log(`Generating meal plan for user: ${spoonacularUsername} with hash: ${spoonacularHash}`);

        if (!spoonacularUsername || !spoonacularHash) {
            return rejectWithValue('User not connected to Spoonacular.');
        }

        try {
            const response = await fetch(
                `https://api.spoonacular.com/mealplanner/generate?apiKey=${spoonacularAPIKey}&timeFrame=${params.timeFrame}&targetCalories=${params.targetCalories}&diet=${params.diet}&exclude=${params.exclude}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate meal plan');
            }

            const mealPlan = await response.json();
            return mealPlan;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchUserTemplates = createAsyncThunk(
    'user/fetchTemplates',
    async (_, { getState, rejectWithValue }) => {
        const { spoonacularUsername, spoonacularHash } = getState().user;
        console.log(`username: ${spoonacularUsername}`);

        if (!spoonacularUsername || !spoonacularHash) {
            return rejectWithValue('User not connected to Spoonacular.');
        }

        try {
            const response = await fetch(
                `https://api.spoonacular.com/mealplanner/${spoonacularUsername}/templates?hash=${spoonacularHash}&apiKey=${spoonacularAPIKey}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch templates');
            }

            const templates = await response.json();
            return templates;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    spoonacularUsername: null,
    spoonacularHash: null,
    templates: null,
    mealPlan: null,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        registerUser: (state, action) => {
            state.user = {
              username: action.payload.username,
              password: action.payload.password,
              email: action.payload.email,
            };
            state.isLoggedIn = true;
          },
        loginUser: (state, action) => {
            const { username, password } = action.payload;

            // Mock login logic
            if (state.user && state.user.username === username && state.user.password === password) {
                state.isLoggedIn = true;
            } else {
                state.error = 'Invalid credentials';
            }
        },
        logoutUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.spoonacularUsername = null;
            state.spoonacularHash = null;
            state.templates = [];
            state.mealPlan = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(connectUserToSpoonacular.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(connectUserToSpoonacular.fulfilled, (state, action) => {
                state.spoonacularUsername = action.payload.username; // Save Spoonacular username
                state.spoonacularHash = action.payload.hash; // Save Spoonacular hash
                state.isLoggedIn = true;
                state.loading = false;
              })
            .addCase(connectUserToSpoonacular.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to connect to Spoonacular';
            })
            .addCase(generateMealPlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateMealPlan.fulfilled, (state, action) => {
                state.mealPlan = action.payload;
                state.loading = false;
            })
            .addCase(generateMealPlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to generate meal plan';
            })
            .addCase(fetchUserTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTemplates.fulfilled, (state, action) => {
                state.templates = action.payload;  // Store fetched templates
                state.loading = false;
            })
            .addCase(fetchUserTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch templates';
            });
    },
});

export const { registerUser, loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
