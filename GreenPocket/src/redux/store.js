import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice';
import recipeDetailsReducer from './recipeDetailsSlice';
export default configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetails: recipeDetailsReducer,
  },
});
