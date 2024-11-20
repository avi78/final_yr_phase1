import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import ImageSlider from "../../components/Home/ImageSlider"; // Your ImageSlider component
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import { Audio } from "expo-av";
import Colors from "../../constants/Colors";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

export default function Sos() {
  const [location, setLocation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to track if audio is playing
  const soundRef = useRef(); // Reference to the sound for later use
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const { user } = useUser();

  // Request location permission and fetch the current location
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords); // Save the current location in state
    };

    // Fetch emergency contacts from Firestore
    const fetchEmergencyContacts = async () => {
      try {
        const docRef = doc(db, "emergencyContacts", user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmergencyContacts(docSnap.data().contacts || []);
        } else {
          console.log("No contacts found");
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    getLocation();
    if (user) fetchEmergencyContacts();
  }, [user]);

  // Function to play the SOS alert sound
  const playAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/sos.mp3"), // Replace with the path to your SOS alert sound file
        { isLooping: true } // Set the audio to loop until manually stopped
      );
      soundRef.current = sound;
      await sound.playAsync();
      setIsPlaying(true); // Set state to playing
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  // Function to stop the SOS alert sound
  const stopAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setIsPlaying(false); // Set state to not playing
      }
    } catch (error) {
      console.log("Error stopping sound:", error);
    }
  };

  // Function to send the SOS message
  const sendSms = async () => {
    if (!location) {
      Alert.alert("Location Error", "Unable to fetch location.");
      return;
    }

    const message = `I need help! My current location is: https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const phoneNumbers = emergencyContacts.map(
      (contact) => contact.phoneNumber
    );

    if (phoneNumbers.length === 0) {
      Alert.alert("No Emergency Contacts", "No emergency contacts found.");
      return;
    }

    try {
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);

      if (result === "sent") {
        Alert.alert("SOS Sent", "Your SOS alert has been sent successfully!");
      } else {
        Alert.alert("SOS Sent", "Your SOS alert has been sent successfully!");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      Alert.alert("Error", "There was an issue sending the SOS alert.");
    }
  };

  // Reset the audio state when the user navigates away or performs other actions
  const resetAudioState = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync(); // Stop the audio if any
      setIsPlaying(false); // Set state to not playing
    }
  };

  useEffect(() => {
    // Reset audio state when navigating back to the screen
    return () => {
      resetAudioState();
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* SOS Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SOS Alert</Text>
        <Text style={styles.subHeaderText}>
          In case of emergency, send your location instantly.
        </Text>
      </View>

      {/* ImageSlider Component */}
      <ImageSlider />

      {/* SOS Button */}
      <TouchableOpacity onPress={sendSms} style={styles.sosButton}>
        <Text style={styles.sosButtonText}>Send SOS Alert</Text>
      </TouchableOpacity>

      {/* Play Audio Button */}
      <TouchableOpacity
        onPress={playAudio}
        style={styles.audioButton}
        disabled={isPlaying} // Disable button if audio is already playing
      >
        <Text style={styles.audioButtonText}>Play SOS Audio</Text>
      </TouchableOpacity>

      {/* Stop Audio Popup */}
      {isPlaying && (
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>SOS Audio is playing</Text>
            <TouchableOpacity onPress={stopAudio} style={styles.stopButton}>
              <Text style={styles.stopButtonText}>Stop Audio</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 16,
  },
  header: {
    backgroundColor: Colors.RED,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 32,
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.WHITE,
    marginTop: 10,
    textAlign: "center",
  },
  sosButton: {
    backgroundColor: Colors.RED,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  audioButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  audioButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
  popupContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  popup: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stopButton: {
    backgroundColor: Colors.SECONDARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.WHITE,
  },
});
