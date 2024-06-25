import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [orchid, setOrchid] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      axios
        .get(`https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`)
        .then((response) => {
          setOrchid(response.data);
          setIsFavorite(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching orchid details:", error);
        });
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  const toggleFavorite = async () => {
    try {
      const newStatus = !isFavorite;

      // Update favorite status in API
      await axios.put(
        `https://64b391b20efb99d862680d7a.mockapi.io/orchids/${id}`,
        {
          status: newStatus ? true : false,
        }
      );

      // Update orchid status in AsyncStorage
      if (newStatus) {
        await AsyncStorage.setItem(
          `orchid_${id}`,
          JSON.stringify({
            id,
            status: 1,
            image: orchid.image,
            name: orchid.name,
            weight: orchid.weight,
            rating: orchid.rating,
          })
        );
        showAlert(`${orchid.name} added to favorites!`);
      } else {
        await AsyncStorage.removeItem(`orchid_${id}`);
        showRemoveAlert(`${orchid.name} removed from favorites!`);
      }

      // Update orchid status in the local state
      setIsFavorite(newStatus);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  const showAlert = (message) => {
    Alert.alert("Success", message);
  };

  const showRemoveAlert = (message) => {
    Alert.alert(
      "Remove from Favorites",
      message,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={orchid ? { uri: orchid.image } : null}
      style={styles.backgroundImage}
      blurRadius={2}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={orchid ? { uri: orchid.image } : null}
            style={styles.image}
          />
          <Text style={styles.name}>{orchid ? orchid.name : ""}</Text>
          <Text style={styles.description}>
            {orchid ? orchid.description : ""}
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.weight + "g" : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rating</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.rating + "/5" : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.price + "$" : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Color</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.color : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bonus</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.bonus : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Origin</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.origin : ""}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailText}>
                {orchid ? orchid.category : ""}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={toggleFavorite}
          style={styles.favoriteButton}
        >
          <View
            style={[styles.favoriteIcon, isFavorite && styles.favoriteBorder]}
          >
            <Icon
              name={isFavorite ? "favorite" : "favorite-outline"}
              size={30}
              color={isFavorite ? "#2196F3" : "#FFFFFF"}
            />
          </View>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "white",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "white",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  detailText: {
    color: "white",
    fontSize: 16,
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  favoriteIcon: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
    padding: 5,
  },
  favoriteBorder: {
    borderColor: "#2196F3",
  },
});
