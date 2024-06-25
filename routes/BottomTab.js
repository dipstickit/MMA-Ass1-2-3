import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/AntDesign";
import IconEntypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "../screens/HomeScreen";
import FavouriteScreen from "../screens/FavouriteScreen";
import UserProfileScreen from "../screens/UserProfileScreen"; // Import UserProfileScreen
import LoginScreen from "../screens/LoginScreen"; // Import LoginScreen

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken"); // Remove userToken from AsyncStorage
      navigation.navigate("Login"); // Navigate to LoginScreen after logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error if needed
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerTransparent: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          overflow: "hidden",
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={"#416D19"} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconEntypo name="list" size={size} color={"#416D19"} />
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconEntypo name="user" size={size} color={"#416D19"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
