import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spoonacularAPIKey } from '../config/appSettings';

// Helper to remove duplicate recipes
function removeDuplicates(recipes) {
  const uniqueRecipes = [];
  const seen = new Set();

  recipes.forEach((recipe) => {
    if (!seen.has(recipe.id)) {
      uniqueRecipes.push(recipe);
      seen.add(recipe.id);
    }
  });

  return uniqueRecipes;
}

// Fetch recipes with filters and pagination
export const fetchRecipes = createAsyncThunk(
  'recipes/fetchRecipes',
  async ({ category = '', categories = [], query = '', cuisine = '', diets = [], calories = [], offset = 0, number = 10 }, thunkAPI) => {
    const selectedCategory = category.toLowerCase();
    const selectedQuery = query.toLowerCase();

    // Construct the base URL with or without category
    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${spoonacularAPIKey}&offset=${offset}&number=${number}`;

    // Handle search query
    if (selectedQuery) {
      url += `&query=${selectedQuery}`;
    }

    // Handle category (e.g., breakfast, lunch, etc.)
    if (selectedCategory) {
      url += `&type=${selectedCategory}`;
    }

    // Handle cuisine
    if (cuisine) {
      url += `&cuisine=${cuisine}`;
    }

    // Handle diets
    if (diets.length > 0) {
      const dietString = diets.join(',');
      url += `&diet=${dietString}`;
    }

    // Handle calories range
    if (calories.length === 2) {
      url += `&minCalories=${calories[0]}&maxCalories=${calories[1]}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Removing duplicates
    const uniqueRecipes = removeDuplicates(data.results);

    return {
      results: uniqueRecipes, // filtered and deduplicated array of recipes
      offset,
      number,
      totalResults: data.totalResults,
    };
  }
);


export const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    loading: false,
    error: null,
    offset: 0,
    number: 10,
    totalResults: 0,
    category: '', // Defaults to an empty string
    query: '',
    diets: [], // Empty array means no diet filters
    calories: [0, 0], // Default calories range to [0, 0]
    onlyFavourites: false,
    cuisine: '',
    excludedCuisine: [],
    categories: [], // Default empty array
  },
  reducers: {
    clearRecipes: (state) => {
      state.recipes = [];
      state.offset = 0;
      state.totalResults = 0;
    },
    setFilters: (state, action) => {
      state.category = action.payload.category;
      state.diets = action.payload.diets;
      state.cuisine = action.payload.cuisine;
      state.calories = action.payload.calories;
    },
    clearFilters: (state) => {
      state.category = '';
      state.diets = [];
      state.cuisine = '';
      state.calories = [0, 0];

    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        if (action.meta.arg.offset === 0) {
          // Reset the recipes if it's a new query or category
          state.recipes = action.payload.results;
        } else {
          // Append more recipes when scrolling
          state.recipes = [...state.recipes, ...action.payload.results];
        }
        state.loading = false;
        state.offset = action.payload.offset + action.payload.number;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearRecipes, setFilters, clearFilters } = recipesSlice.actions;

export const selectRecipes = (state) => state.recipes.recipes;
export const selectLoading = (state) => state.recipes.loading;
export const selectOffset = (state) => state.recipes.offset;
export const selectTotalResults = (state) => state.recipes.totalResults;

export default recipesSlice.reducer;
