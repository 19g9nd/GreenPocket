import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilters, setFilters, fetchRecipes } from '../redux/recipesSlice';

//TODO: Fix not working with search params,style 
export const FilterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.recipes);

  const [selectedCategories, setSelectedCategories] = useState(filters.category || '');
  const [selectedDiets, setSelectedDiets] = useState(filters.diets || []);
  const [selectedCuisine, setSelectedCuisine] = useState(filters.cuisine || '');
  const [selectedCalories, setSelectedCalories] = useState(filters.calories || [0, 0]);

  const [filtersUpdated, setFiltersUpdated] = useState(false);

  useEffect(() => {
    setFiltersUpdated(true);
  }, [selectedCategories, selectedDiets, selectedCuisine, selectedCalories]);

  const handleApplyFilters = () => {
    if (filtersUpdated) {
      dispatch(setFilters({
        category: selectedCategories,
        diets: selectedDiets,
        cuisine: selectedCuisine,
        calories: selectedCalories,
      }));

      dispatch(fetchRecipes({
        category: selectedCategories,
        diets: selectedDiets,
        cuisine: selectedCuisine,
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
    { id: "2", text: "Dinner" }
  ];

  const dietOptions = [
    { id: "0", text: "Vegan" },
    { id: "1", text: "Vegetarian" },
    { id: "2", text: "Gluten-Free" }
  ];

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
            setSelectedItems(value); // Single selection for categories
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

      {/* Cuisine Input */}
      <Text style={styles.sectionTitle}>Cuisine</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Cuisine"
        value={selectedCuisine}
        onChangeText={setSelectedCuisine}
      />

      {/* Calories Input */}
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
    backgroundColor: '#4CAF50', // Highlight for selected options
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
    backgroundColor: '#007BFF', // Apply button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  clearButton: {
    backgroundColor: '#FF6347', // Clear button color (tomato red)
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
