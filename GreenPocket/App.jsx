import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {DiaryScreen} from './src/screens/Diary';
import {RecipesScreen} from './src/screens/Recipes';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import {RecipeDetailsScreen} from './src/screens/RecipeDetails';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const App = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Tab.Navigator  screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Diary" component={DiaryScreen} />
        <Tab.Screen name="Recipes" component={RecipesScreen} />
        <Tab.Screen name="RecipeDetails" component={RecipeDetailsScreen}  />
      </Tab.Navigator>
    </NavigationContainer>

    </Provider>
  );
};
const styles = StyleSheet.create({});

export default App;
