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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase.config";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterScreen = ({ navigation }) => {
  const formik = useFormik({
    initialValues: { email: "", password: "", confirmPassword: "" },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const user = userCredential.user;
        setSubmitting(false);
        navigation.navigate("Login");
      } catch (error) {
        setSubmitting(false);
        Alert.alert("Error", error.message);
      }
    },
  });

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          onChangeText={formik.handleChange("confirmPassword")}
          onBlur={formik.handleBlur("confirmPassword")}
          value={formik.values.confirmPassword}
          secureTextEntry
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <Text style={styles.errorText}>{formik.errors.confirmPassword}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={formik.handleSubmit}
        disabled={formik.isSubmitting}
      >
        <Text style={styles.buttonText}>
          {formik.isSubmitting ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={handleLogin}>
          Login here
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#007bff",
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
    backgroundColor: "#007bff",
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
  loginText: {
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
    marginTop: 2, // Add margin top
    marginLeft: 10, // Move error text to the left
  },
});

export default RegisterScreen;
