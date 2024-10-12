import React from 'react';
import { Text, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';

export function HomeScreen({ navigation }) {
  // Categories and their emojis
  const categories = [
    { name: 'Breakfast', emoji: '🌅' }, 
    { name: 'Lunch', emoji: '🍎' }, 
    { name: 'Salads', emoji: '🥗' }, 
    { name: 'Drinks', emoji: '🍫' }, 
    { name: 'Dinner', emoji: '🍔' }, 
    { name: 'Desserts', emoji: '🍨' }
  ];

  // Services and their emojis
  const services = [
    { name: 'Menu for week', emoji: '📅' }, 
    { name: 'Product list', emoji: '🛒' }, 
    { name: 'Find recipe', emoji: '🔍' }
  ];

  // Category item rendering
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Recipes', { category: item.name })}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Service item rendering
  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceItem}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hi, User!</Text>
      <Text style={styles.subHeaderText}>Recipes</Text>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionHeader}>Services</Text>

      {/* Services List */}
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
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
    color: '#3D3D3D',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#3D3D3D',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#3D3D3D',
  },
  listContainer: {
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#F1F5BD', // Light green background for categories
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#3D3D3D',
  },
  serviceItem: {
    backgroundColor: '#F1F4BD',
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#3D3D3D',
  },
  emoji: {
    fontSize: 30, // Increased font size for emojis to make them prominent
  },
});
