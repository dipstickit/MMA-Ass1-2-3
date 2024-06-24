import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // Import axios for making API calls
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook

// Notification component
const Notification = ({ message }) => (
  <View style={styles.notification}>
    <Text style={styles.notificationText}>{message}</Text>
  </View>
);

const FavouriteScreen = () => {
  const navigation = useNavigation(); // Access navigation using useNavigation hook

  const [orchids, setOrchids] = useState([]);
  const [notification, setNotification] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const loadOrchidsFromStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const orchids = await AsyncStorage.multiGet(keys);
      const filteredOrchids = orchids
        .filter(([key, value]) => key.startsWith("orchid_"))
        .map(([key, value]) => JSON.parse(value));
      setOrchids(filteredOrchids);
    } catch (error) {
      console.error("Error loading orchids from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadOrchidsFromStorage);

    return unsubscribe;
  }, [navigation]);

  const removeOrchid = async (id) => {
    try {
      await AsyncStorage.removeItem(`orchid_${id}`);
      await updateOrchidStatus(id, false); // Call API to update status to false

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Animation duration in milliseconds
        useNativeDriver: true,
      }).start(() => {
        setOrchids((prevOrchids) =>
          prevOrchids.filter((orchid) => orchid.id !== id)
        );
        setNotification("Orchid removed successfully!");
        setTimeout(() => {
          setNotification("");
        }, 3000); // Clear notification after 3 seconds
      });
    } catch (error) {
      console.error("Error removing orchid from AsyncStorage:", error);
    }
  };

  const clearAllOrchids = async () => {
    try {
      await AsyncStorage.multiRemove(
        orchids.map((orchid) => `orchid_${orchid.id}`)
      );
      setOrchids([]);
      await Promise.all(
        orchids.map((orchid) => updateOrchidStatus(orchid.id, false))
      ); // Call API to update status to false for all orchids

      setNotification("All orchids cleared successfully!");
      setTimeout(() => {
        setNotification("");
      }, 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error("Error clearing all orchids from AsyncStorage:", error);
    }
  };

  const updateOrchidStatus = async (id, status) => {
    try {
      await axios.put(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`,
        { status }
      );
    } catch (error) {
      console.error("Error updating orchid status:", error);
    }
  };

  const renderOrchidItem = ({ item }) => (
    <Animated.View style={{ ...styles.orchidItem, opacity: fadeAnim }}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.orchidName}>{item.name}</Text>
      <TouchableOpacity onPress={() => removeOrchid(item.id)}>
        <Feather name="trash" size={24} color="red" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {notification ? <Notification message={notification} /> : null}
      <FlatList
        data={orchids}
        renderItem={renderOrchidItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearAllOrchids}>
        <Text style={styles.clearButtonText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light gray background
    padding: 20,
  },
  orchidItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd", // Lighter border color
    paddingVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  orchidName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    color: "#333", // Dark text color
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: "#e74c3c", // Red background for clear button
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  clearButtonText: {
    color: "#fff", // White text color for clear button
    fontSize: 16,
    textAlign: "center",
  },
  notification: {
    backgroundColor: "#2ecc71", // Green background color
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: "#fff", // White text color
    fontSize: 16,
    textAlign: "center",
  },
});

export default FavouriteScreen;
