import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spoonacularAPIKey } from '../config/appSettings';

export const fetchRecipeDetails = createAsyncThunk(
  'recipeDetails/fetchRecipeDetails',
  async (recipeId, thunkAPI) => {
    console.log('spoonacularAPIKey', spoonacularAPIKey)
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonacularAPIKey}&includeNutrition=true`
    );
    if (!response.ok) {
      throw new Error(result.message || 'Failed to connect to API');
    }
    const data = await response.json();
    return data;
  }
);

export const fetchRandomRecipeDetails = createAsyncThunk(
  'recipeDetails/fetchRandomRecipeDetails',
  async (thunkAPI) => {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?number=1&apiKey=${spoonacularAPIKey}&includeNutrition=true`
    );

    const data = await response.json();
    return data.recipes[0]; // Random recipes come in an array, select the first one
  }
);

const recipeDetailsSlice = createSlice({
  name: 'recipeDetails',
  initialState: {
    recipe: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeDetails.fulfilled, (state, action) => {
        state.recipe = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecipeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRandomRecipeDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRandomRecipeDetails.fulfilled, (state, action) => {
        state.recipe = action.payload;
        state.loading = false;
      })
      .addCase(fetchRandomRecipeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectRecipeDetails = (state) => state.recipeDetails.recipe;
export const selectRecipeDetailsLoading = (state) => state.recipeDetails.loading;

export default recipeDetailsSlice.reducer;
