import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Button, Modal, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { generateMealPlan } from '../redux/userSlice';

export function DiaryScreen({ navigation }) {
    const dispatch = useDispatch();
    const { mealPlan, loading, error } = useSelector((state) => state.user);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [targetCalories, setTargetCalories] = useState(2000);
    const [diet, setDiet] = useState('');
    const [exclude, setExclude] = useState('');

    useEffect(() => {
        fetchMealPlan();
    }, [dispatch]);

    const fetchMealPlan = () => {
        const params = {
            timeFrame: 'week',
            targetCalories,
            diet,
            exclude,
        };

        dispatch(generateMealPlan(params));
    };

    const handleRefresh = () => {
        fetchMealPlan();
    };

    if (loading) {
        return <Text style={styles.loadingText}>Generating meal plan...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const weeklyMeals = mealPlan?.week;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Meal Plan:</Text>
            <View style={styles.buttonContainer}>
                <Button color="#388E3C" title="Filters" onPress={() => setFilterModalVisible(true)} />
                <Button color="#388E3C" title="Refresh" onPress={handleRefresh} />
            </View>
            {weeklyMeals ? (
                Object.keys(weeklyMeals).map((day) => (
                    <View key={day} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                        <FlatList
                            data={weeklyMeals[day].meals}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.mealCard}
                                    onPress={() => navigation.navigate('RecipeDetails', {
                                        recipeId: item.id,
                                        image: `https://spoonacular.com/recipeImages/${item.id}-${item.imageType}`,
                                    })}
                                >
                                    <Image
                                        source={{ uri: `https://img.spoonacular.com/recipes/${item.id}-90x90.${item.imageType}` }}
                                        style={styles.mealImage}
                                    />
                                    <Text style={styles.mealTitle}>{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                ))
            ) : (
                <Text style={styles.noMealsText}>No meals found in the generated meal plan.</Text>
            )}

            {/* Filter Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Set Your Filters</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Target Calories"
                        keyboardType="numeric"
                        value={targetCalories.toString()}
                        onChangeText={(text) => setTargetCalories(Number(text))}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Diet (e.g. vegetarian)"
                        value={diet}
                        onChangeText={setDiet}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Exclude Ingredients"
                        value={exclude}
                        onChangeText={setExclude}
                    />
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => {
                            setFilterModalVisible(false);
                            handleRefresh();
                        }}
                    >
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setFilterModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#E8F5E9', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#388E3C',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dayContainer: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 1,
    },
    dayTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#388E3C',
        marginBottom: 8,
    },
    mealCard: {
        marginRight: 12,
        width: 120,
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#C8E6C9',
        alignItems: 'center',
    },
    mealImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    mealTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 4,
        textAlign: 'center',
        color: '#388E3C', 
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#388E3C', 
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        color: 'red',
    },
    noMealsText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#388E3C'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388E3C', 
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#81C784', 
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
        color: '#388E3C', 
    },
    applyButton: {
        backgroundColor: '#388E3C', 
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 10,
    },
    closeButtonText: {
        color: 'red',
        fontWeight: 'bold',
    },
});
