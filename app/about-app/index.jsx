import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Colors from "@/constants/Colors";

export default function AboutWomenSafety() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🌸 About</Text>

      {/* Introduction Section */}
      <Text style={styles.sectionHeader}>🌟 Purpose of the App</Text>
      <Text style={styles.text}>
        This app is designed to enhance women's safety by offering quick access
        to features that help in emergencies. Our goal is to empower users with
        simple yet effective tools to stay safe anytime, anywhere. 🌍
      </Text>

      {/* Features Section */}
      <Text style={styles.sectionHeader}>✨ Features of the App</Text>
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Ionicons
            name="alert-circle"
            size={24}
            color={Colors.SECONDARY}
            style={styles.icon}
          />
          <Text style={styles.featureText}>SOS Button for emergencies 🚨</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons
            name="location-outline"
            size={24}
            color={Colors.SECONDARY}
            style={styles.icon}
          />
          <Text style={styles.featureText}>Real-time location sharing 📍</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons
            name="map"
            size={24}
            color={Colors.SECONDARY}
            style={styles.icon}
          />
          <Text style={styles.featureText}>Map-based safe routes 🗺️</Text>
        </View>
        <View style={styles.featureItem}>
          <FontAwesome6
            name="contact-book"
            size={24}
            color={Colors.SECONDARY}
            style={styles.icon}
          />
          <Text style={styles.featureText}>
            Contact list for instant alerts 📞
          </Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons
            name="shield-checkmark"
            size={24}
            color={Colors.SECONDARY}
            style={styles.icon}
          />
          <Text style={styles.featureText}>
            Educational content for self-defense and safety tips 🛡️
          </Text>
        </View>
      </View>

      {/* Motivation Section */}
      <Text style={styles.sectionHeader}>💡 Our Motivation</Text>
      <Text style={styles.text}>
        🌷 With the increasing need for safety measures, especially for women,
        we were driven by a desire to create a technology-driven solution that
        addresses real-world challenges. Our app is built on the belief that
        safety is a fundamental right, and we aim to make it more accessible.
      </Text>

      {/* Closing Statement */}
      <Text style={styles.text}>
        🚀 Together, we can create a safer environment for everyone. Thank you
        for trusting us to be a part of your safety journey! ❤️
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.SECONDARY,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  text: {
    fontSize: 16,
    color: Colors.GRAY,
    lineHeight: 24,
    marginBottom: 30,
  },
  features: {
    marginVertical: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 8,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: Colors.GRAY,
    flexShrink: 1,
  },
});
