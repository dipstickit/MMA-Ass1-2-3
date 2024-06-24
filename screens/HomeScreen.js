import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [orchids, setOrchids] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrchids();
    });

    return unsubscribe;
  }, []);

  const fetchOrchids = async () => {
    try {
      const response = await axios.get(
        "https://64b391b20efb99d862680d7a.mockapi.io/orchids"
      );
      setOrchids(response.data);
    } catch (error) {
      console.error("Error fetching orchids:", error);
    }
  };

  const toggleFavorite = async (id, currentStatus, image, name) => {
    try {
      const newStatus = !currentStatus;
      // Update favorite status in API
      await axios.put(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`,
        { status: newStatus }
      );

      // Update orchid status in AsyncStorage
      if (newStatus) {
        await AsyncStorage.setItem(
          `orchid_${id}`,
          JSON.stringify({ id, status: newStatus, image, name })
        );
        showNotification(`${name} added to favorites!`);
      } else {
        await AsyncStorage.removeItem(`orchid_${id}`);
        showNotification(`${name} removed from favorites!`);
      }

      // Update orchid status in the local state
      setOrchids((prevOrchids) =>
        prevOrchids.map((orchid) =>
          orchid.id === id ? { ...orchid, status: newStatus } : orchid
        )
      );
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const showNotification = (message) => {
    Alert.alert("Notification", message);
  };

  const renderOrchidItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate("DetailScreen", {
          id: item.id,
        });
      }}
    >
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item.image }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.orchidName}>{item.name}</Text>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: item.status ? "#2196F3" : "#FFFFFF" },
          ]}
          onPress={() =>
            toggleFavorite(item.id, item.status, item.image, item.name)
          }
        >
          <Icon
            name={item.status ? "favorite" : "favorite-border"}
            size={24}
            color={item.status ? "#FFFFFF" : "#2196F3"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={orchids}
        renderItem={renderOrchidItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD", // Light blue background
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  flatList: {
    width: "100%",
  },
  cardContainer: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#FFFFFF", // White cards
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 120,
    overflow: "hidden",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  orchidName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
