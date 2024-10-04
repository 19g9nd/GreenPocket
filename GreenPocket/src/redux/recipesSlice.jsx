import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import {spoonacularAPIKey} from '../config/appSettings';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async (category = '', thunkAPI) => {
    const selectedCategory = category.toLowerCase();
    const url = selectedCategory
      ? `https://api.spoonacular.com/recipes/complexSearch?type=${selectedCategory}&apiKey=${spoonacularAPIKey}`
      : `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPIKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.results; // array of recipes
  }
);

export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes:[],
    loading:false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.recipes = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectRecipes = (state) => state.recipes.recipes;
export const selectLoading = (state) => state.recipes.loading;

export default recipesSlice.reducer;
