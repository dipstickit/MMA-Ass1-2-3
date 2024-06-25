// import storage from "@react-native-firebase/storage";

// const uploadImage = async (uri, imageName) => {
//   const storageRef = storage().ref(`images/${imageName}`);

//   try {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     await storageRef.put(blob);
//     console.log("Image uploaded successfully!");
//     return storageRef.getDownloadURL();
//   } catch (error) {
//     console.error("Error uploading image: ", error);
//     throw error;
//   }
// };

// export default uploadImage;
