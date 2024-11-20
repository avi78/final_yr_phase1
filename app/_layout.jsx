import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import React, { useEffect } from "react";

const tokenCache = {
  async getToken(key) {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("AsyncStorage get item error: ", error);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.error("AsyncStorage set item error:", err);
    }
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

  const [fontsLoaded] = useFonts({
    "poppin": require("../assets/fonts/Poppins-Regular.ttf"),
    "poppin-medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "poppin-bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "poppin-semibold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "poppin-extrabold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "poppin-thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "poppin-light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading fonts...</Text>;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <AuthenticationWrapper>
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="login/index" options={{ headerShown: false }} />
          </Stack>
        </AuthenticationWrapper>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AuthenticationWrapper({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log("User is not signed in. Redirecting to /login...");
      router.push("/login");
    } else if (isLoaded && isSignedIn) {
      console.log("User is signed in. Redirecting to /home...");
      router.push("/home");
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return <>{children}</>;
}
