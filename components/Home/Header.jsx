import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";

const { width } = Dimensions.get("window");

export default function Header() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.userName}>{user?.fullName}</Text>
      </View>
      <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%",
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    shadowColor: Colors.GRAY,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontFamily: "poppin-medium",
    fontSize: 16,
    color: Colors.GRAY,
  },
  userName: {
    fontFamily: "poppin-semibold",
    fontSize: 20,
    color: Colors.PRIMARY,
  },
  profileImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 100,
  },
});
