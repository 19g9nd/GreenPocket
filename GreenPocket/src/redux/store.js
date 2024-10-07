import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice';
import recipeDetailsReducer from './recipeDetailsSlice';
import favouritesReducer from './favoutitesSlice'
export default configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetails: recipeDetailsReducer,
    favourites: favouritesReducer
  },
});
