import {
  fetchRecipeDetails,
  selectRecipeDetails,
  selectRecipeDetailsLoading,
} from '../redux/recipeDetailsSlice';
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView,Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

// @ts-ignore
export function RecipeDetailsScreen({ route,navigation }) {
  const { recipeId } = route.params;
  const dispatch = useDispatch();
  const recipe = useSelector(selectRecipeDetails);
  const loading = useSelector(selectRecipeDetailsLoading);
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchRecipeDetails(recipeId));
  }, [recipeId, dispatch]);

  if (loading) {
  <Button onPress={() => navigation.goBack()} title="Dismiss" />
    return <Text>Loading ...</Text>
  }


  //TODO: ADD TAGS SUCH AS diet AND dishTypes, calories,price per serving etc.
  return recipe ? (
    <ScrollView style={styles.container}>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
      <Text style={styles.title}>{recipe.title}</Text>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <FlatList
          data={recipe.extendedIngredients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.ingredientItem}>
              <Text>{item.original}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
          recipe.analyzedInstructions[0].steps.map((step) => (
            <Text key={step.number} style={styles.instructionText}>
              {step.number}. {step.step}
            </Text>
          ))
        ) : (
          <Text>No instructions provided.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text>{recipe.summary.replace(/<\/?b>/g, '')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <Text>Ready in Minutes: {recipe.readyInMinutes}</Text>
        <Text>Servings: {recipe.servings}</Text>
        <Text>Health Score: {recipe.healthScore}</Text>
      </View>
    </ScrollView>
  ) : (
    <Text>Recipe not found</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  ingredientItem: {
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
