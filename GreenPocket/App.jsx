import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {HomeScreen} from './src/screens/Home';
import {DiaryScreen} from './src/screens/Diary';
import {RecipesScreen} from './src/screens/Recipes';
import {FavouritesScreen} from './src/screens/Favourites';
import {RecipeDetailsScreen} from './src/screens/RecipeDetails'
import {FilterScreen} from './src/screens/FilterScreen';
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
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Diary" component={DiaryScreen} />
    <Tab.Screen name="Recipes" component={RecipesScreen} />
    <Tab.Screen name="Favourites" component={FavouritesScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BottomTab"
            component={BottomTabNavigator}
            options={{ headerShown: false}}
          />
          <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{headerShown: false}} />
          <Stack.Screen name="Filters" component={FilterScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
