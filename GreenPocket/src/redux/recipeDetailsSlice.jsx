import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spoonacularAPIKey } from '../config/appSettings';

export const fetchRecipeDetails = createAsyncThunk(
  'recipeDetails/fetchRecipeDetails',
  async (recipeId, thunkAPI) => {
    console.log('spoonacularAPIKey', spoonacularAPIKey)
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonacularAPIKey}`
    );
    const data = await response.json();
    console.log(data);
    return data;
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
      });
  },
});

export const selectRecipeDetails = (state) => state.recipeDetails.recipe;
export const selectRecipeDetailsLoading = (state) => state.recipeDetails.loading;

export default recipeDetailsSlice.reducer;
