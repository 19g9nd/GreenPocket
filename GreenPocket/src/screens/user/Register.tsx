import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { connectUserToSpoonacular, registerUser } from '../../redux/userSlice';

export function RegistrationScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const dispatch = useDispatch();
  const { loading, error, spoonacularUsername } = useSelector((state) => state.user);

  const handleRegister = async () => {
    dispatch(registerUser({ username, password, email }));

    const resultAction = await dispatch(
      connectUserToSpoonacular({
        username,
        firstName,
        lastName,
        email,
      })
    );

    if (connectUserToSpoonacular.fulfilled.match(resultAction)) {
      console.log('Connected to Spoonacular successfully!');
      navigation.navigate('Home');
      console.log('Successfully connected to Spoonacular:', resultAction.payload);
    } else {
      console.log('Connection to Spoonacular failed:', error);
    }
  };

  useEffect(() => {
    if (spoonacularUsername) {
      console.log(`Spoonacular connection successful with username: ${spoonacularUsername}`);
    }
  }, [spoonacularUsername]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#9E9E9E"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#9E9E9E"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#9E9E9E"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#9E9E9E"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#9E9E9E"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C', 
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#81C784', 
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#388E3C', 
  },
  button: {
    backgroundColor: '#388E3C', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
});
