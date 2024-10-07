import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites, removeFromFavourites, selectFavourites } from '../redux/favoutitesSlice';
import { selectRecipeDetailsLoading } from '../redux/recipeDetailsSlice';

// @ts-ignore
export function FavouritesScreen() {
  const favourites = useSelector(selectFavourites);
  const loading = useSelector(selectRecipeDetailsLoading);


  if (loading) {
    return (
      <View>
        <Text>Loading ...</Text>
      </View>
    );
  }

  if (favourites.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No favourite recipes yet.</Text>
      </View>
    );
  }
//TODO: Show Recipe image and name, add unfavourite button 
  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeTitle}>{item.title}</Text>
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
          </View>
        )}
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
  recipeItem: {
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    color: 'red',
  }, recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  toggleButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  favouriteButton: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});
