import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilters, setFilters, fetchRecipes } from '../redux/recipesSlice';

export const FilterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.recipes);

  const [selectedCategories, setSelectedCategories] = useState(filters.category || '');
  const [selectedDiets, setSelectedDiets] = useState(filters.diets || []);
  const [selectedCuisine, setSelectedCuisine] = useState(filters.cuisine || '');
  const [selectedIntolerances, setSelectedIntolerances] = useState(filters.intolerances || []);
  const [selectedMealType, setSelectedMealType] = useState(filters.mealType || '');
  const [maxReadyTime, setMaxReadyTime] = useState(filters.maxReadyTime || 0);
  const [selectedCalories, setSelectedCalories] = useState(filters.calories || [0, 0]);

  const [filtersUpdated, setFiltersUpdated] = useState(false);

  // Trigger filter update check when any filter changes
  useEffect(() => {
    setFiltersUpdated(true);
  }, [selectedCategories, selectedDiets, selectedCuisine, selectedIntolerances, selectedMealType, maxReadyTime, selectedCalories]);

  // Apply filters and fetch recipes
  const handleApplyFilters = () => {
    if (filtersUpdated) {
      dispatch(setFilters({
        category: selectedCategories,
        diets: selectedDiets,
        cuisine: selectedCuisine,
        intolerances: selectedIntolerances,
        mealType: selectedMealType,
        maxReadyTime,
        calories: selectedCalories,
      }));

      dispatch(fetchRecipes({
        category: selectedCategories,
        diets: selectedDiets,
        cuisine: selectedCuisine,
        intolerances: selectedIntolerances,
        mealType: selectedMealType,
        maxReadyTime,
        calories: selectedCalories,
      }));

      setFiltersUpdated(false);
      navigation.navigate('Recipes', { category: selectedCategories, query: '' });
    } else {
      alert("No changes made to the filters.");
    }
  };

  const categoryOptions = [
    { id: "0", text: "Breakfast" },
    { id: "1", text: "Lunch" },
    { id: "2", text: "Dinner" },
    { id: "3", text: "Salads" },
    { id: "4", text: "Drinks" },
    { id: "5", text: "Snacks" },
    { id: "6", text: "Appetizers" },
    { id: "7", text: "Desserts" },
  ];

  const dietOptions = [
    { id: "0", text: "Vegan" },
    { id: "5", text: "Ovo-Vegetarian" },
    { id: "1", text: "Vegetarian" },
    { id: "2", text: "Gluten Free" },
    { id: "3", text: "Ketogenic" },
    { id: "4", text: "Lacto-Vegetarian" },
    { id: "6", text: "Pescetarian" },
    { id: "7", text: "Paleo" },
    { id: "8", text: "Primal" },
    { id: "9", text: "Low FODMAP" },
    { id: "10", text: "Whole30" }
  ];


  const cuisineOptions = [
    { id: "0", text: "African" },
    { id: "1", text: "American" },
    { id: "2", text: "British" },
    { id: "3", text: "Cajun" },
    { id: "4", text: "Caribbean" },
    { id: "5", text: "Chinese" },
    { id: "6", text: "Eastern European" },
    { id: "7", text: "European" },
    { id: "8", text: "French" },
    { id: "9", text: "German" },
    { id: "10", text: "Greek" },
    { id: "11", text: "Indian" },
    { id: "12", text: "Irish" },
    { id: "13", text: "Italian" },
    { id: "14", text: "Japanese" },
    { id: "15", text: "Jewish" },
    { id: "16", text: "Korean" },
    { id: "17", text: "Latin American" },
    { id: "18", text: "Mediterranean" },
    { id: "19", text: "Mexican" },
    { id: "20", text: "Middle Eastern" },
    { id: "21", text: "Nordic" },
    { id: "22", text: "Southern" },
    { id: "23", text: "Spanish" },
    { id: "24", text: "Thai" },
    { id: "25", text: "Vietnamese" }
  ];

  const intoleranceOptions = [
    { id: "0", text: "Dairy" },
    { id: "1", text: "Peanut" },
    { id: "2", text: "Soy" },
    { id: "3", text: "Wheat" },
  ];

  const mealTypeOptions = [
    { id: "0", text: "Main Course" },
    { id: "1", text: "Side Dish" },
    { id: "2", text: "Dessert" },
  ];

  // Reusable function for rendering options (for both single and multiple selections)
  const renderOption = (option, selectedItems, setSelectedItems, singleSelection = false) => {
    const isSelected = singleSelection
      ? selectedItems === option.text.toLowerCase()
      : selectedItems.includes(option.text.toLowerCase());

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionButton, isSelected && styles.selectedOptionButton]}
        onPress={() => {
          const value = option.text.toLowerCase();
          if (singleSelection) {
            setSelectedItems(value); // Single selection for categories and meal type
          } else {
            setSelectedItems((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
            );
          }
        }}
      >
        <Text style={styles.optionText}>{option.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Filter Options</Text>

      {/* Categories Filter */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.optionsContainer}>
        {categoryOptions.map((option) =>
          renderOption(option, selectedCategories, setSelectedCategories, true)
        )}
      </View>

      {/* Diets Filter */}
      <Text style={styles.sectionTitle}>Diets</Text>
      <View style={styles.optionsContainer}>
        {dietOptions.map((option) =>
          renderOption(option, selectedDiets, setSelectedDiets)
        )}
      </View>

      {/* Intolerances Filter */}
      <Text style={styles.sectionTitle}>Intolerances</Text>
      <View style={styles.optionsContainer}>
        {intoleranceOptions.map((option) =>
          renderOption(option, selectedIntolerances, setSelectedIntolerances)
        )}
      </View>

      {/* Meal Type Filter */}
      <Text style={styles.sectionTitle}>Meal Type</Text>
      <View style={styles.optionsContainer}>
        {mealTypeOptions.map((option) =>
          renderOption(option, selectedMealType, setSelectedMealType, true)
        )}
      </View>

      {/* Cuisine Filter (only available cuisines) */}
      <Text style={styles.sectionTitle}>Cuisine</Text>
      <View style={styles.optionsContainer}>
        {cuisineOptions.map((option) =>
          renderOption(option, selectedCuisine, setSelectedCuisine, true)
        )}
      </View>

      {/* Calories Range Input */}
      <Text style={styles.sectionTitle}>Calories Range</Text>
      <View style={styles.caloriesContainer}>
        <TextInput
          style={styles.caloriesInput}
          placeholder="Min"
          keyboardType="numeric"
          value={selectedCalories[0] !== 0 ? selectedCalories[0].toString() : ''}
          onChangeText={(min) => {
            const minValue = parseInt(min);
            setSelectedCalories([isNaN(minValue) ? 0 : minValue, selectedCalories[1]]);
          }}
        />
        <Text style={styles.rangeText}>-</Text>
        <TextInput
          style={styles.caloriesInput}
          placeholder="Max"
          keyboardType="numeric"
          value={selectedCalories[1] !== 0 ? selectedCalories[1].toString() : ''}
          onChangeText={(max) => {
            const maxValue = parseInt(max);
            setSelectedCalories([selectedCalories[0], isNaN(maxValue) ? 0 : maxValue]);
          }}
        />
      </View>

      {/* Max Ready Time Filter */}
      <Text style={styles.sectionTitle}>Max Ready Time (minutes)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 30"
        keyboardType="numeric"
        value={maxReadyTime !== 0 ? maxReadyTime.toString() : ''}
        onChangeText={(time) => setMaxReadyTime(parseInt(time) || 0)}
      />

      {/* Apply and Clear Buttons */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          setSelectedCategories('');
          setSelectedDiets([]);
          setSelectedCuisine('');
          setSelectedIntolerances([]);
          setSelectedMealType('');
          setMaxReadyTime(0);
          setSelectedCalories([0, 0]);
          dispatch(clearFilters());
        }}
      >
        <Text style={styles.buttonText}>Clear Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: 100,
  },
  rangeText: {
    marginHorizontal: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOptionButton: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  applyButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  clearButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterScreen;
