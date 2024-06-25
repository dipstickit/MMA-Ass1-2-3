import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";

const EditScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [rating, setRating] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    fetchOrchid();
  }, []);

  const fetchOrchid = async () => {
    try {
      const response = await axios.get(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`
      );
      const { name, weight, rating, origin } = response.data;
      console.log(typeof weight);
      setName(name);
      setWeight(weight);
      setRating(rating);
      setOrigin(origin);
    } catch (error) {
      console.error("Error fetching orchid:", error);
    }
  };

  const updateOrchid = async () => {
    try {
      const updatedOrchid = { name, weight, rating, origin };
      await axios.put(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`,
        updatedOrchid
      );
      Alert.alert("Success", "Orchid updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating orchid:", error);
      Alert.alert("Error", "Failed to update orchid. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
      />
      <Text style={styles.label}>Weight</Text>
      <TextInput
        style={styles.input}
        value={weight.toString()}
        onChangeText={(text) => setWeight(Number(text))}
        placeholder="Enter weight"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Rating</Text>
      <TextInput
        style={styles.input}
        value={rating}
        onChangeText={setRating}
        placeholder="Enter rating"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Origin</Text>
      <TextInput
        style={styles.input}
        value={origin}
        onChangeText={setOrigin}
        placeholder="Enter origin"
      />
      <TouchableOpacity style={styles.button} onPress={updateOrchid}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#333333",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditScreen;
