import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromFavourites, selectFavourites } from '../redux/favoutitesSlice';
import { selectRecipeDetailsLoading } from '../redux/recipeDetailsSlice';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../components/colors'; 

export function FavouritesScreen() {
  const favourites = useSelector(selectFavourites);
  const loading = useSelector(selectRecipeDetailsLoading);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading ...</Text>
      </View>
    );
  }

  if (favourites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No favourite recipes yet.</Text>
      </View>
    );
  }

  const handleRemoveFavourite = (id) => {
    dispatch(removeFromFavourites({ id }));
  };

  const handleRecipePress = (id) => {
    navigation.navigate('RecipeDetails', { recipeId: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favourites}
        showsVerticalScrollIndicator={false} 
        keyExtractor={(item, index) => `${item.original}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <TouchableOpacity onPress={() => handleRecipePress(item.id)} style={styles.touchableArea}>
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              <View style={styles.recipeDetails}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => handleRemoveFavourite(item.id)}
            >
              <Text style={styles.heartText}>💔</Text>
            </TouchableOpacity>
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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeItem: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: Colors.recipeItem,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  touchableArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recipeDetails: {
    marginLeft: 10,
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary, 
  },
  recipeDescription: {
    fontSize: 12,
    color: Colors.textSecondary, 
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  heartButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  heartText: {
    fontSize: 24,
    color: Colors.heartButton, 
  },
});
