import { configureStore } from '@reduxjs/toolkit';
import recipesReducer from './recipesSlice';
import recipeDetailsReducer from './recipeDetailsSlice';
import favouritesReducer from './favoutitesSlice';
import userReducer from './userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// redux-persist action types to ignore for serializable checks
const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const favouritesConfig = {
  key: 'favourites',
  storage: AsyncStorage,
  whitelist: ['favourites'],
};
const userConfig = {
  key: 'user',
  storage: AsyncStorage
};
export const store = configureStore({
  reducer: {
    recipes: recipesReducer,
    recipeDetails: recipeDetailsReducer,
    favourites: persistReducer(favouritesConfig, favouritesReducer),
    user: persistReducer(userConfig, userReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [...reduxPersistActions],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
