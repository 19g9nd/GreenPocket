import React, {useState} from 'react';
import { Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// @ts-ignore
export function HomeScreen({ navigation }) {
  const categories = ['Breakfast', 'Lunch', 'Salads', 'Drinks', 'Dinner', 'Desserts'];
  const services = ['Menu for week', 'Product list', 'Find recipe'];
  const [searchQuery, setSearchQuery] = useState('');
  // @ts-ignore
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => navigation.navigate('Recipes', { category: item })}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  // @ts-ignore
  const renderService = ({ item }) => (
    <TouchableOpacity style={styles.serviceItem}>
      <Text style={styles.serviceText}>{item}</Text>
    </TouchableOpacity>
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Recipes', { query: searchQuery });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hi, User!</Text>
      <Text style={styles.subHeaderText}>Recipes</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search here"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={handleSearch}
        />
      </View>

      <Text style={styles.sectionHeader}>Categories</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <Text style={styles.sectionHeader}>Services</Text>
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
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 18,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  serviceItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
