import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { useUser, useAuth } from "@clerk/clerk-expo";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function Profile() {
  const Menu = [
    {
      id: 1,
      name: "User Details",
      icon: "person",
      path: "./../user-details", // This can route to the UserDetails screen or component
    },
    {
      id: 2,
      name: "Add Contacts",
      icon: "phone-portrait",
      path: "./../add-contacts", // This can route to the Add Contacts screen
    },
    {
      id: 3,
      name: "About",
      icon: "information-circle",
      path: "./../about-app", // This can route to the Women Safety screen with engaging content
    },
    {
      id: 4,
      name: "Logout",
      icon: "exit",
      path: "logout",
    },
  ];

  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useAuth();

  const onPressMenu = (menu) => {
    if (menu.name === "Logout") {
      signOut();
      return;
    }
    router.push(menu.path);
  };

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "poppin-semibold",
          fontSize: 30,
        }}
      >
        Profile
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginVertical: 25,
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
          }}
        />
        <Text
          style={{
            fontFamily: "poppin-bold",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          {user?.fullName}
        </Text>
        <Text
          style={{
            fontFamily: "poppin",
            fontSize: 16,
            color: Colors.GRAY,
          }}
        >
          {user?.primaryEmailAddress.emailAddress}
        </Text>
      </View>

      <FlatList
        data={Menu}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={{
              marginVertical: 10,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Ionicons
              name={item?.icon}
              size={35}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: Colors.LIGHT_SECONDARY,
              }}
            />
            <Text
              style={{
                fontFamily: "poppin-medium",
                fontSize: 18,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
