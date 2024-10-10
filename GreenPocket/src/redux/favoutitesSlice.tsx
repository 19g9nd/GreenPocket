import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  favourites: [],
  loading:false,
  error: null,
};

export const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      if (!state.favourites.find(item => item.id === action.payload.id)) {
        state.favourites = [...state.favourites, action.payload];
      } else {
        state.favourites = state.favourites.filter(
          item => item.id !== action.payload.id,
        );
      }
    },
    removeFromFavourites: (state, action) => {
      if (state.favourites.find(item => item.id === action.payload.id)) {
        state.favourites = state.favourites.filter(
          item => item.id !== action.payload.id,
        );
      }
    },
  },

});

export const { addToFavourites, removeFromFavourites } = favouritesSlice.actions;

export const selectFavourites = (state) => state.favourites.favourites;
export const selectLoading = (state) => state.favourites.loading;
export default favouritesSlice.reducer;