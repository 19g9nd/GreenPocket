import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipeDetails, selectRecipeDetails, selectRecipeDetailsLoading } from '../redux/recipeDetailsSlice';
import { addToFavourites, removeFromFavourites, selectFavourites } from '../redux/favoutitesSlice';
import { Colors } from '../components/colors';
import BackIcon from '../assets/icons/arrowBack';
import SvgIcon from '../components/SvgIcon';

export function RecipeDetailsScreen({ route, navigation }) {
  const { recipeId } = route.params;
  const dispatch = useDispatch();
  const recipe = useSelector(selectRecipeDetails);
  const loading = useSelector(selectRecipeDetailsLoading);
  const favourites = useSelector(selectFavourites);
  const isFavourite = favourites.some((fav) => fav.id === recipeId);

  const [unitSystem, setUnitSystem] = useState('metric'); 
  const [portionSize, setPortionSize] = useState(recipe?.servings || 1); 
  const [showAdditionalVitamins, setShowAdditionalVitamins] = useState(false); // Collapsible section

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
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const NutrientCircle = ({ label, value, size = 'large' }) => (
    <View style={[styles.nutrientCircle, size === 'small' && styles.smallCircle]}>
      <Text style={styles.nutrientValue}>{value}</Text>
      <Text style={styles.nutrientLabel}>{label}</Text>
    </View>
  );

  const renderIngredients = ({ item }) => {
    const { amount, measures } = item;
    const displayAmount = (measures[unitSystem].amount * portionSize).toFixed();
    const displayUnit = measures[unitSystem].unitShort;

    return (
      <View style={styles.ingredientItem}>
        <Text style={styles.ingredientText}>{`${displayAmount} ${displayUnit} of ${item.nameClean}`}</Text>
      </View>
    );
  };

  const renderInstructions = () => {
    return recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
      recipe.analyzedInstructions[0].steps.map((step) => (
        <Text key={step.number} style={styles.instructionText}>
          {step.number}. {step.step}
        </Text>
      ))
    ) : (
      <Text style={styles.instructionText}>No instructions provided.</Text>
    );
  };

  const mainNutrients = ['Calories', 'Carbohydrates', 'Protein'];
  const renderNutrients = () => {
    return (
      <>
        <View style={styles.mainNutrientsContainer}>
          {recipe.nutrition.nutrients
            .filter((nutrient) => mainNutrients.includes(nutrient.name))
            .map((nutrient) => (
              <NutrientCircle
                key={nutrient.name}
                label={nutrient.name}
                value={`${(nutrient.amount * portionSize).toFixed(0)} ${nutrient.unit}`}
              />
            ))}
        </View>
        {showAdditionalVitamins && (
          <View style={styles.additionalNutrientsContainer}>
            {recipe.nutrition.nutrients
              .filter((nutrient) => !mainNutrients.includes(nutrient.name))
              .map((nutrient) => (
                <NutrientCircle
                  key={nutrient.name}
                  label={nutrient.name}
                  value={`${(nutrient.amount * portionSize).toFixed(0)} ${nutrient.unit}`}
                  size="small"
                />
              ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowAdditionalVitamins(!showAdditionalVitamins)}
        >
          <Text style={styles.toggleButtonText}>
            {showAdditionalVitamins ? 'Hide Additional Info' : 'Show More Info'}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const toggleUnitSystem = () => {
    setUnitSystem((prev) => (prev === 'metric' ? 'us' : 'metric'));
  };

  const increasePortion = () => {
    setPortionSize((prev) => prev + 1);
  };

  const decreasePortion = () => {
    if (portionSize > 1) {
      setPortionSize((prev) => prev - 1);
    }
  };

  const handlePortionInputChange = (value) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setPortionSize(parsedValue);
    }
  };

  return recipe ? (
    <FlatList
      ListHeaderComponent={
        <View style={styles.headerContainer}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <SvgIcon
              width={24}
              height={24}
              name={BackIcon}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.title}>{recipe.title}</Text>
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

          <View style={styles.favButtonContainer}>
            <TouchableOpacity onPress={handleToggleFavourite} style={styles.favButton}>
              <Text style={styles.favButtonText}>{isFavourite ? '💔 Remove from Favourites' : '🤍 Add to Favourites'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nutrientsContainer}>{renderNutrients()}</View>
          <View style={styles.section}>
            <View style={styles.unitToggleContainer}>
              <TouchableOpacity onPress={toggleUnitSystem} style={styles.unitToggleButton}>
                <Text style={styles.unitToggleText}>{unitSystem === 'metric' ? 'Switch to US Units' : 'Switch to Metric Units'}</Text>
              </TouchableOpacity>
              <View style={styles.portionControls}>
                <TouchableOpacity onPress={decreasePortion} style={styles.portionButton}>
                  <Text>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.portionSizeInput}
                  value={portionSize.toString()}
                  keyboardType="numeric"
                  onChangeText={handlePortionInputChange}
                />
                <TouchableOpacity onPress={increasePortion} style={styles.portionButton}>
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.sectionTitle}>Ingredients</Text>
        </View>
      }
      data={recipe.extendedIngredients}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderIngredients}
      ListFooterComponent={
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {renderInstructions()}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>
            <Text style={styles.additionalInfo}>Price per Serving: ${recipe.pricePerServing}</Text>
            <Text style={styles.additionalInfo}>Ready in Minutes: {recipe.readyInMinutes}</Text>
            <Text style={styles.additionalInfo}>Health Score: {recipe.healthScore}</Text>
          </View>
        </View>
      }
    />
  ) : (
    <Text style={styles.errorText}>Recipe not found</Text>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
  headerContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    marginTop: 10,
    paddingRight:20,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
    paddingLeft: 20
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'grey'
  },
  favButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  favButton: {
    backgroundColor: Colors.heartButton,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  favButtonText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  Text: {
    color: Colors.white,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',

  },
  nutrientsContainer: {
    marginBottom: 20,
  },
  mainNutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  additionalNutrientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  nutrientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  smallCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#333',
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  additionalInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitToggleButton: {
    padding: 10,
    backgroundColor: Colors.textPrimary,
    borderRadius: 5,
  },
  unitToggleText: {
    color: Colors.white,
  },
  portionControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portionButton: {
    padding: 10,
    backgroundColor: Colors.textSecondary,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  portionSizeText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  ingredientItem: {
    marginBottom: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
});