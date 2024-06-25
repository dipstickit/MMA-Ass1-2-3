import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase.config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginScreen = ({ navigation }) => {
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;
        setSubmitting(false);
        await AsyncStorage.setItem("userToken", user.accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        navigation.navigate("Home", { isLoggedIn: true });
      } catch (error) {
        setSubmitting(false);
        Alert.alert("Error", error.message);
      }
    },
  });

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          value={formik.values.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {formik.touched.email && formik.errors.email && (
          <Text style={styles.errorText}>{formik.errors.email}</Text>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          value={formik.values.password}
          secureTextEntry
        />
        {formik.touched.password && formik.errors.password && (
          <Text style={styles.errorText}>{formik.errors.password}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
      >
        <Text style={styles.buttonText}>
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text style={styles.link} onPress={handleRegister}>
          Register here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff", // White background color
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#007bff", // Custom text color
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20, // Rounded corners
    backgroundColor: "#f0f0f0", // Light grey background for inputs
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff", // Blue button color (hex: #007bff)
    borderRadius: 20, // Rounded corners
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555555", // Custom text color
  },
  link: {
    color: "#007bff", // Blue color for link
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginLeft: 10,
  },
});

export default LoginScreen;
