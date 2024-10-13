import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeDetails, selectRecipeDetails, selectRecipeDetailsLoading } from '../redux/recipeDetailsSlice';
import { addToFavourites, removeFromFavourites, selectFavourites } from '../redux/favoutitesSlice';
//TODO: fix price per serving, show vitamins
export function RecipeDetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const dispatch = useDispatch();
  const recipe = useSelector(selectRecipeDetails);
  const loading = useSelector(selectRecipeDetailsLoading);
  const favourites = useSelector(selectFavourites);
  const isFavourite = favourites.some((fav) => fav.id === recipeId);

  const handleToggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites({ id: recipeId }));
    } else {
      dispatch(addToFavourites(recipe));
    }
  };

  useEffect(() => {
    dispatch(fetchRecipeDetails(recipeId));
  }, [recipeId, dispatch]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const NutrientCircle = ({ label, value }) => (
    <View style={styles.nutrientCircle}>
      <Text style={styles.nutrientValue}>{value}</Text>
      <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
  );

  const renderIngredients = ({ item }) => (
    <View style={styles.ingredientItem}>
      <Text>{item.original}</Text>
    </View>
  );

  const renderInstructions = () => {
    return recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
      recipe.analyzedInstructions[0].steps.map((step) => (
        <Text key={step.number} style={styles.instructionText}>
          {step.number}. {step.step}
        </Text>
      ))
    ) : (
      <Text>No instructions provided.</Text>
    );
  };

  return recipe ? (
    <FlatList
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{recipe.title}</Text>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

          <View style={styles.favButtonContainer}>
            <TouchableOpacity onPress={handleToggleFavourite} style={styles.favButton}>
              <Text style={styles.favButtonText}>{isFavourite ? '💔 Remove from Favourites' : '🤍 Add to Favourites'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nutrientsContainer}>
            <NutrientCircle 
              label="Calories" 
              value={`${recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount.toFixed(0) : 'N/A'} kcal`} 
            />
            <NutrientCircle 
              label="Protein" 
              value={`${recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.name === 'Protein')?.amount.toFixed(0) : 'N/A'} g`} 
            />
            <NutrientCircle 
              label="Fat" 
              value={`${recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.name === 'Fat')?.amount.toFixed(0) : 'N/A'} g`} 
            />
            <NutrientCircle 
              label="Carbs" 
              value={`${recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.name === 'Carbohydrates')?.amount.toFixed(0) : 'N/A'} g`} 
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
        </View>
      }
      data={recipe.extendedIngredients}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderIngredients}
      ListFooterComponent={
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {renderInstructions()}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <Text>Price per Serving: ${recipe.pricePerServing}</Text>
            <Text>Ready in Minutes: {recipe.readyInMinutes}</Text>
            <Text>Servings: {recipe.servings}</Text>
            <Text>Health Score: {recipe.healthScore}</Text>
          </View>
        </View>
      }
    />
  ) : (
    <Text>Recipe not found</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F8F8',
  },
  headerContainer: {
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  favButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  favButton: {
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 5,
  },
  favButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  nutrientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#777',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  ingredientItem: {
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});