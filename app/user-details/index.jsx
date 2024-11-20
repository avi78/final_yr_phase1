import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../config/FirebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo"; // Using Clerk for authentication

export default function UserDetails() {
  const { user } = useUser(); // Clerk user info
  const [name, setName] = useState(user?.fullName || ""); // Default to Clerk's full name
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  ); // Clerk email
  const [age, setAge] = useState(""); // State for user's age
  const [phoneNumber, setPhoneNumber] = useState("+91"); // Default Indian phone number

  const userId = user?.id; // Clerk user ID

  // Fetch user data from Firestore (if it exists)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.fullName || "");
          setEmail(data.email || "");
          setAge(data.age?.toString() || "");
          setPhoneNumber(data.phoneNumber || "+91");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Function to handle adding or updating user data
  const handleUpdateDetails = async () => {
    if (!name || !age || !phoneNumber) {
      Alert.alert("Missing Details", "Please fill in all fields.");
      return;
    }

    const userRef = doc(db, "users", userId);

    try {
      await setDoc(
        userRef,
        {
          fullName: name,
          email: email,
          age: parseInt(age, 10), // Store as number
          phoneNumber: phoneNumber,
          profileImageUrl: user?.imageUrl || "",
          isProfileComplete: true,
          updatedAt: serverTimestamp(),
          ...((await getDoc(userRef)).exists()
            ? {}
            : { createdAt: serverTimestamp() }), // Add `createdAt` only if the document is new
        },
        { merge: true } // Merge updates with existing data
      );

      Alert.alert("Success", "Your details have been updated successfully.");
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "Could not update your details. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Details</Text>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Age Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </View>

      {/* Phone Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      {/* Email Display (Read-only) */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email (Read-Only)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f5f5f5" }]}
          value={email}
          editable={false} // Make the email field read-only
        />
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateDetails}
      >
        <Text style={styles.updateButtonText}>Update Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
  },
  updateButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
