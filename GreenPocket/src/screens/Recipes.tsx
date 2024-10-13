import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes, selectRecipes, selectLoading, selectOffset, selectTotalResults, clearRecipes } from '../redux/recipesSlice';
import { fetchRandomRecipeDetails } from '../redux/recipeDetailsSlice';

export function RecipesScreen({ route, navigation }) {
  const { category = '' } = route.params || {};
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectLoading);
  const offset = useSelector(selectOffset);
  const totalResults = useSelector(selectTotalResults);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearRecipes());
      dispatch(fetchRecipes({ category, query: searchQuery, offset: 0 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, category, dispatch]);

  const loadMoreRecipes = () => {
    if (!loading && recipes.length < totalResults) {
      dispatch(fetchRecipes({ category, query: searchQuery, offset }));
    }
  };

  const handleRandomRecipe = async () => {
    const randomRecipe = await dispatch(fetchRandomRecipeDetails()).unwrap();
    if (randomRecipe) {
      navigation.navigate('RecipeDetails', { recipeId: randomRecipe.id });
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeName} numberOfLines={2} ellipsizeMode="tail">
        {item.title || "No title available"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{category ? `${category} Recipes` : 'Recipes'}</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('Filters')}>
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.randomButton} onPress={handleRandomRecipe}>
        <Text style={styles.randomButtonText}>Random Recipe</Text>
      </TouchableOpacity>
      {loading && recipes.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item, index) => `${item.original}-${index}`} showsVerticalScrollIndicator={false}
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
    backgroundColor: '#FDFFEC',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3D3D3D',
  },
  listContainer: {
    paddingBottom: 10,
  },
  recipeItem: {
    backgroundColor: '#F1F5BD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3D3D3D',
    flex: 1,
    marginLeft: 10,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#70a731',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  randomButton: {
    backgroundColor: '#6951f5',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  randomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
});
