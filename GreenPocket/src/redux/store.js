import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice';

export default configureStore({
  reducer: {
    recipes: recipesReducer,
  },
});
