import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';

// @ts-ignore
export function RecipesScreen({route, navigation}) {
  const {category} = route.params || '';
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const selectedCategory = category ? category.toLowerCase() : '';
    const url = selectedCategory
      ? `https://api.spoonacular.com/recipes/complexSearch?type=${selectedCategory}&apiKey=db7c6cb5efa547068f9f57b21cb1855d`
      : `https://api.spoonacular.com/recipes/complexSearch?apiKey=db7c6cb5efa547068f9f57b21cb1855d`;

    fetch(
      url,
    )
      .then(response => response.json())
      .then(data => {
        setRecipes(data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      });
  }, [category]);

  // @ts-ignore
  const renderRecipe = ({item}) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => navigation.navigate('RecipeDetails', {recipeId: item.id})}>
      <Image source={{uri: item.image}} style={styles.recipeImage} />
      <Text style={styles.recipeName}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{category} Recipes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
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
});
