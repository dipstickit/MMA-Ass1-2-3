import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import uploadImage from "../utils/uploadImage";

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  weight: yup
    .number()
    .required("Weight is required")
    .positive("Weight must be positive")
    .integer("Weight must be an integer"),
  rating: yup
    .number()
    .required("Rating is required")
    .min(0, "Rating must be between 0 and 5")
    .max(5, "Rating must be between 0 and 5"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive"),
  image: yup
    .string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  color: yup.string().required("Color is required"),
  bonus: yup.string().required("Bonus is required"),
  origin: yup.string().required("Origin is required"),
  category: yup.string().required("Category is required"),
  isTopOfTheWeek: yup
    .boolean()
    .required("Please select Top of the Week status"),
  status: yup.boolean().required("Please select Status"),
});

const CreateScreen = ({ navigation }) => {
  const handleCreateOrchid = async (values) => {
    try {
      // const imageUrl = await uploadImage(values.image, values.name);
      // const orchidData = { ...values, image: imageUrl };
      await axios.post(
        "https://64b391b20efb99d862680d7a.mockapi.io/orchids",
        values
        // orchidData
      );

      await AsyncStorage.setItem(`orchid_${values.id}`, JSON.stringify(values));
      // await AsyncStorage.setItem(`orchid_${values.id}`, JSON.stringify(orchidData));

      Alert.alert("Success", "Orchid created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error creating orchid:", error);
      Alert.alert("Error", "Failed to create orchid. Please try again later.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          name: "",
          weight: "",
          rating: "",
          price: "",
          image: "",
          color: "",
          bonus: "",
          origin: "",
          category: "",
          isTopOfTheWeek: false,
          status: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleCreateOrchid({
            ...values,
            id: String(Math.floor(Math.random() * 1000)),
          });
          resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="Enter name"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("weight")}
                onBlur={handleBlur("weight")}
                value={values.weight}
                keyboardType="numeric"
                placeholder="Enter weight"
              />
              {touched.weight && errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("rating")}
                onBlur={handleBlur("rating")}
                value={values.rating}
                keyboardType="numeric"
                placeholder="Enter rating"
              />
              {touched.rating && errors.rating && (
                <Text style={styles.errorText}>{errors.rating}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("price")}
                onBlur={handleBlur("price")}
                value={values.price}
                keyboardType="numeric"
                placeholder="Enter price"
              />
              {touched.price && errors.price && (
                <Text style={styles.errorText}>{errors.price}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Image URL:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("image")}
                onBlur={handleBlur("image")}
                value={values.image}
                placeholder="Enter image URL"
              />
              {touched.image && errors.image && (
                <Text style={styles.errorText}>{errors.image}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("color")}
                onBlur={handleBlur("color")}
                value={values.color}
                placeholder="Enter color"
              />
              {touched.color && errors.color && (
                <Text style={styles.errorText}>{errors.color}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Bonus:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("bonus")}
                onBlur={handleBlur("bonus")}
                value={values.bonus}
                placeholder="Enter bonus"
              />
              {touched.bonus && errors.bonus && (
                <Text style={styles.errorText}>{errors.bonus}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Origin:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("origin")}
                onBlur={handleBlur("origin")}
                value={values.origin}
                placeholder="Enter origin"
              />
              {touched.origin && errors.origin && (
                <Text style={styles.errorText}>{errors.origin}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category:</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("category")}
                onBlur={handleBlur("category")}
                value={values.category}
                placeholder="Enter category"
              />
              {touched.category && errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Is Top of the Week:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    values.isTopOfTheWeek ? styles.radioButtonSelected : null,
                  ]}
                  onPress={() => setFieldValue("isTopOfTheWeek", true)}
                >
                  <Text style={styles.radioText}>True</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    !values.isTopOfTheWeek ? styles.radioButtonSelected : null,
                  ]}
                  onPress={() => setFieldValue("isTopOfTheWeek", false)}
                >
                  <Text style={styles.radioText}>False</Text>
                </TouchableOpacity>
              </View>
              {touched.isTopOfTheWeek && errors.isTopOfTheWeek && (
                <Text style={styles.errorText}>{errors.isTopOfTheWeek}</Text>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Status:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    values.status ? styles.radioButtonSelected : null,
                  ]}
                  onPress={() => setFieldValue("status", true)}
                >
                  <Text style={styles.radioText}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    !values.status ? styles.radioButtonSelected : null,
                  ]}
                  onPress={() => setFieldValue("status", false)}
                >
                  <Text style={styles.radioText}>Inactive</Text>
                </TouchableOpacity>
              </View>
              {touched.status && errors.status && (
                <Text style={styles.errorText}>{errors.status}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSubmit}
            >
              <Text style={styles.createButtonText}>Create Orchid</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
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
    fontSize: 16,
    color: "#333333",
  },
  createButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    backgroundColor: "#2196F3",
  },
  radioText: {
    color: "#333333",
    fontSize: 14,
  },
});

export default CreateScreen;
