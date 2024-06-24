import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Button,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const FavouriteScreen = () => {
  const navigation = useNavigation();
  const [orchids, setOrchids] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadOrchidsFromStorage);

    return unsubscribe;
  }, [navigation]);

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

  const removeOrchid = async (id) => {
    try {
      await AsyncStorage.removeItem(`orchid_${id}`);
      setOrchids((prevOrchids) =>
        prevOrchids.filter((orchid) => orchid.id !== id)
      );
      await updateOrchidStatus(id, false);
      showAlert("Orchid Removed Successfully");
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
      );
      showAlert("All Orchids Cleared Successfully");
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

  const showAlert = (message) => {
    Alert.alert(
      "Notification",
      message,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const renderOrchidItem = ({ item }) => (
    <View style={styles.orchidItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.orchidName}>{item.name}</Text>
        <Text style={styles.additionalInfo}>
          Weight: {item.weight}g | Rating: {item.rating}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeOrchid(item.id)}>
        <Feather name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {orchids.length === 0 ? (
        <Text style={styles.noItemsText}>No Orchids found in favourites.</Text>
      ) : (
        <FlatList
          data={orchids}
          renderItem={renderOrchidItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      {orchids.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={clearAllOrchids}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  orchidItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  },
  additionalInfo: {
    fontSize: 14,
    color: "#666",
  },
  clearButton: {
    backgroundColor: "#1E90FF", // Màu xanh dương
    borderRadius: 10, // Độ bo tròn
    padding: 15,
    alignItems: "center",
    marginTop: 20, // Khoảng cách với FlatList
  },
  clearButtonText: {
    color: "#fff", // Màu chữ trắng
    fontSize: 18,
    fontWeight: "bold",
  },
  noItemsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
});

export default FavouriteScreen;
