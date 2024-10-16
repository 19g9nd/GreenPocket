import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { HomeScreen } from './src/screens/Home';
import { DiaryScreen } from './src/screens/Diary';
import { RecipesScreen } from './src/screens/Recipes';
import { FavouritesScreen } from './src/screens/Favourites';
import { RecipeDetailsScreen } from './src/screens/RecipeDetails';
import { FilterScreen } from './src/screens/FilterScreen';
import { RegistrationScreen } from './src/screens/user/Register';  
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';

import HomeIcon from './src/assets/icons/home.svg';
import DiaryIcon from './src/assets/icons/diary.svg';
import RecipesIcon from './src/assets/icons/recipes.svg';
import FavouritesIcon from './src/assets/icons//heart.svg';
import SvgIcon from './src/components/SvgIcon';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: 'black' },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <SvgIcon
            width={size}
            height={size}
            name={HomeIcon}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Diary"
      component={DiaryScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <SvgIcon
            width={size}
            height={size}
            name={DiaryIcon}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Recipes"
      component={RecipesScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <SvgIcon
            width={size}
            height={size}
            name={RecipesIcon}
            color={color}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Favourites"
      component={FavouritesScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <SvgIcon
            width={size}
            height={size}
            name={FavouritesIcon}
            color={color}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const MainNavigator = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Get the login state from Redux

  return (
    <Stack.Navigator>
      {!isLoggedIn ? ( // If the user is not logged in, show RegistrationScreen
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{ headerShown: false }}
        />
      ) : ( // If the user is logged in, show the main layout (BottomTabNavigator)
        <>
          <Stack.Screen
            name="BottomTab"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecipeDetails"
            component={RecipeDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Filters"
            component={FilterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
