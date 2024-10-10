import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, selectRecipes, selectLoading, selectOffset, selectTotalResults, clearRecipes } from '../redux/recipesSlice';

export function RecipesScreen({ route, navigation }) {
  const { category = '', query = '' } = route.params || {};
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectLoading);
  const offset = useSelector(selectOffset);
  const totalResults = useSelector(selectTotalResults);

  useEffect(() => {
    // Clear previous recipes and fetch new ones on category or query change
    dispatch(clearRecipes());
    dispatch(fetchRecipes({ category, query, offset: 0 }));
  }, [category, query, dispatch]);

  const loadMoreRecipes = () => {
    // Only load more if there are still more recipes to load and not currently loading
    if (!loading && recipes.length < totalResults) {
      dispatch(fetchRecipes({ category, query, offset }));
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeName}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{category ? `${category} Recipes` : 'Recipes'}</Text>
      <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Filters')}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      {loading && recipes.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreRecipes}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && recipes.length > 0 ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  recipeItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '500',
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#007BFF', // Blue color for button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#FFFFFF', // White color for text
    fontSize: 16,
    fontWeight: 'bold',
  },
});
