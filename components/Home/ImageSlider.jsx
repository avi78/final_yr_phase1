import { View, Text, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function ImageSlider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetImages(); // Update function name for clarity
  }, []);

  const GetImages = async () => {
    setSliderList([]); // Clear the list before fetching new data
    try {
      const snapshot = await getDocs(collection(db, "images")); // Fetch from "images" collection
      snapshot.forEach((doc) => {
        setSliderList((prevList) => [...prevList, doc.data()]); // Append data to state
      });
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()} // Ensure unique keys
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    height: 150,
    width: Dimensions.get("screen").width * 0.9,
    borderRadius: 10,
    marginRight: 10,
  },
});
