import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { useOAuth, useAuth } from "@clerk/clerk-expo";
import { makeRedirectUri } from "expo-auth-session";
import Colors from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

// Browser warm-up hook for smoother OAuth experience
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function LoginScreen() {
  const router = useRouter();
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { isSignedIn } = useAuth();

  const onPress = useCallback(async () => {
    try {
      // If the user is already signed in, navigate to the home page
      if (isSignedIn) {
        console.log("User is already signed in. Redirecting to Home...");
        router.push("/home");
        return;
      }

      // Start the OAuth flow with a redirect URL
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: makeRedirectUri({
          path: "/(tabs)/home",
        }),
      });

      // Check if the session was successfully created
      if (createdSessionId) {
        console.log(
          "Google OAuth sign-in successful. Session ID:",
          createdSessionId
        );
        router.push("/home"); // Redirect to the home page
      } else {
        console.log("Sign-in failed. No Session ID found.");
      }
    } catch (err) {
      console.error("Error during sign-in process:", err); // Log any errors during the sign-in process
    }
  }, [router, startOAuthFlow, isSignedIn]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/login.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>SafePath</Text>
        <Text style={styles.subtitle}>
          Real-time navigation, prioritizing your safety every step.
        </Text>
        <Pressable onPress={onPress} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </Pressable>
        <Text style={styles.copyright}>
          © 2024 SafePath. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: height * 0.4,
    marginBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "poppin-bold",
    fontSize: 32,
    textAlign: "center",
    color: Colors.PRIMARY,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "poppin",
    fontSize: 16,
    textAlign: "center",
    color: Colors.GRAY,
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    width: "80%",
    marginBottom: 20,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "poppin-medium",
    fontSize: 18,
    color: Colors.WHITE,
  },
  copyright: {
    fontFamily: "poppin",
    fontSize: 12,
    textAlign: "center",
    color: Colors.GRAY,
    marginTop: 20,
  },
});
