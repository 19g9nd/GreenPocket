import React from 'react';
import { Text, FlatList, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Colors } from '../components/colors';

export function HomeScreen({ navigation }) {
  const username = useSelector((state) => state.user.user.username);
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
    { name: 'Show Favourites', emoji: '💗' },
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
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => {
        if (item.name === 'Find recipe') {
          navigation.navigate('Recipes');
        }
        if (item.name === 'Menu for week') {
          navigation.navigate('Diary');
        }
        if (item.name === 'Show Favourites') {
          navigation.navigate('Favourites');
        }
      }}
    >
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hi, {username}!</Text>
      <Text style={styles.sectionHeader}>Recipes</Text>

      <View style={styles.recipesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          numColumns={2} // Display in 2 columns
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <Text style={styles.sectionHeader}>Services</Text>

      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item, index) => `${item.name}-${index}`}
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
  recipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    backgroundColor: Colors.categoryItem,
    padding: 10,
    borderRadius: 12,
    margin: 5, 
    width: '48%',
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
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  serviceText: {
    fontSize: 14, 
    fontWeight: '500',
    marginLeft: 10,
    color: Colors.textPrimary,
  },
  emoji: {
    fontSize: 30,
  },
});
