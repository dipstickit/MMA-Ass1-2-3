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

function HomeScreen({ navigation, route }) {
  const [orchids, setOrchids] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginNotification, setShowLoginNotification] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchOrchids();
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation, route]);

  useEffect(() => {
    if (isLoggedIn && !showLoginNotification) {
      setShowLoginNotification(true);
      showLoginSuccessNotification();
    }
  }, [isLoggedIn]);

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

  const checkLoginStatus = async () => {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      setIsLoggedIn(true);
    }
  };

  const showLoginSuccessNotification = async () => {
    try {
      await AsyncStorage.setItem("loginNotificationShown", "true");
      Alert.alert("Notification", "Login successful!");
    } catch (error) {
      console.error("Error saving login notification status:", error);
    }
  };

  const toggleFavorite = async (
    id,
    currentStatus,
    image,
    name,
    weight,
    rating
  ) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`,
        { status: newStatus }
      );

      if (newStatus) {
        await AsyncStorage.setItem(
          `orchid_${id}`,
          JSON.stringify({ id, status: newStatus, image, name, weight, rating })
        );
        showNotification(`${name} added to favorites!`);
      } else {
        await AsyncStorage.removeItem(`orchid_${id}`);
        showNotification(`${name} removed from favorites!`);
      }

      setOrchids((prevOrchids) =>
        prevOrchids.map((orchid) =>
          orchid.id === id ? { ...orchid, status: newStatus } : orchid
        )
      );
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const deleteOrchid = async (id, name) => {
    try {
      await axios.delete(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`
      );
      setOrchids((prevOrchids) =>
        prevOrchids.filter((orchid) => orchid.id !== id)
      );
      showNotification(`${name} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting orchid:", error);
    }
  };

  const showNotification = (message) => {
    Alert.alert("Notification", message);
  };

  const navigateToEditScreen = (id) => {
    navigation.navigate("EditScreen", { id });
  };

  const navigateToCreateScreen = () => {
    navigation.navigate("CreateScreen");
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
        <Text style={styles.orchidInfo}>
          Rating: {item.rating} | Origin: {item.origin}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              {
                backgroundColor: item.status ? "#2196F3" : "#FFFFFF",
                borderColor: item.status ? "#FFFFFF" : "#2196F3",
              },
            ]}
            onPress={() =>
              toggleFavorite(
                item.id,
                item.status,
                item.image,
                item.name,
                item.weight,
                item.rating
              )
            }
          >
            <Icon
              name={item.status ? "favorite" : "favorite-border"}
              size={24}
              color={item.status ? "#FFFFFF" : "#2196F3"}
            />
          </TouchableOpacity>
          <View style={styles.rightButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToEditScreen(item.id)}
            >
              <Icon name="edit" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteOrchid(item.id, item.name)}
            >
              <Icon name="delete" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={navigateToCreateScreen}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  flatList: {
    width: "100%",
  },
  cardContainer: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
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
  orchidInfo: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  rightButtons: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 8,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  createButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 16,
    borderRadius: 45,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
