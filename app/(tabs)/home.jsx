import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Map from "../../components/Home/Map";

export default function Home() {
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      {/* Header */}
      <Header />
      {/* Map */}
      <Map />
    </View>
  );
}
