import React from 'react';
import { Text, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Colors } from '../components/colors';

export function HomeScreen({ navigation }) {
  const categories = [
    { name: 'Breakfast', emoji: '🌅' },
    { name: 'Lunch', emoji: '🍎' },
    { name: 'Salads', emoji: '🥗' },
    { name: 'Drinks', emoji: '🍫' },
    { name: 'Dinner', emoji: '🍔' },
    { name: 'Desserts', emoji: '🍨' },
  ];

  const services = [
    { name: 'Menu for week', emoji: '📅' },
    { name: 'Product list', emoji: '🛒' },
    { name: 'Find recipe', emoji: '🔍' },
  ];

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Recipes', { category: item.name })}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

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

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => `${item.original}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionHeader}>Services</Text>

      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item, index) => `${item.original}-${index}`}
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
    backgroundColor: Colors.background,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  listContainer: {
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: Colors.categoryItem,
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
    color: Colors.textPrimary,
  },
  serviceItem: {
    backgroundColor: Colors.serviceItem,
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
    color: Colors.textPrimary,
  },
  emoji: {
    fontSize: 30,
  },
});
