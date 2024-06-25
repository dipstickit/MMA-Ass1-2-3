import React from "react";
import { AppRegistry, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./routes/BottomTab";
import DetailScreen from "./screens/DetailScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import EditScreen from "./screens/EditScreen";
import CreateScreen from "./screens/CreateScreen";
import { enableScreens } from "react-native-screens";

enableScreens();

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={BottomTab} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} />
        <Stack.Screen name="EditScreen" component={EditScreen} />
        <Stack.Screen name="CreateScreen" component={CreateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

AppRegistry.registerComponent("main", () => App);

export default App;
