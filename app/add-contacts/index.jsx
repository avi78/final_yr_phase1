import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import * as Contacts from "expo-contacts";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [savedContacts, setSavedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  // Request permission to access contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      } else {
        Alert.alert(
          "Permission Denied",
          "We need access to your contacts to continue."
        );
      }
    })();

    // Fetch saved emergency contacts from Firebase
    const fetchSavedContacts = async () => {
      try {
        const contactDoc = await getDoc(doc(db, "emergencyContacts", user.id));
        if (contactDoc.exists()) {
          setSavedContacts(contactDoc.data().contacts || []);
        }
      } catch (error) {
        console.error("Error fetching saved contacts: ", error);
      }
    };

    if (user) {
      fetchSavedContacts();
    }
  }, [user]);

  // Handle selecting a contact
  const handleSelectContact = (contact) => {
    const phoneNumber =
      contact.phoneNumbers && contact.phoneNumbers[0]?.number
        ? contact.phoneNumbers[0].number
        : "No Number";
    const newContact = { id: contact.id, name: contact.name, phoneNumber };
    if (!selectedContacts.some((c) => c.id === newContact.id)) {
      setSelectedContacts((prev) => [...prev, newContact]);
    }
  };

  // Handle saving selected contacts to Firebase
  const handleSaveContacts = async () => {
    if (selectedContacts.length === 0) {
      Alert.alert(
        "No Contacts Selected",
        "Please select at least one contact."
      );
      return;
    }

    try {
      const allContacts = [...savedContacts, ...selectedContacts];
      await setDoc(doc(db, "emergencyContacts", user.id), {
        contacts: allContacts,
      });
      Alert.alert(
        "Contacts Saved",
        "Your emergency contacts have been updated."
      );
      setSavedContacts(allContacts);
      setSelectedContacts([]); // Clear selected contacts
    } catch (error) {
      console.error("Error saving contacts: ", error);
      Alert.alert("Error", "There was an issue saving your contacts.");
    }
  };

  // Handle deleting a contact
  const handleDeleteContact = async (contactId) => {
    try {
      const updatedContacts = savedContacts.filter(
        (contact) => contact.id !== contactId
      );
      await updateDoc(doc(db, "emergencyContacts", user.id), {
        contacts: updatedContacts,
      });
      setSavedContacts(updatedContacts);
      Alert.alert("Contact Deleted", "The contact has been removed.");
    } catch (error) {
      console.error("Error deleting contact: ", error);
      Alert.alert("Error", "There was an issue deleting the contact.");
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Emergency Contacts</Text>

        {/* Search bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Display saved emergency contacts */}
        <Text style={styles.sectionHeader}>Saved Emergency Contacts</Text>
        <View style={styles.contactContainer}>
          {savedContacts.length > 0 ? (
            <FlatList
              data={savedContacts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Prevents FlatList scrolling
              renderItem={({ item }) => (
                <View style={styles.contactItem}>
                  <View>
                    <Text style={styles.contactName}>{item.name}</Text>
                    <Text style={styles.contactNumber}>{item.phoneNumber}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteContact(item.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noContactsText}>
              No emergency contacts saved yet.
            </Text>
          )}
        </View>

        {/* Display available contacts from phone */}
        <Text style={styles.sectionHeader}>Add New Emergency Contact</Text>
        <View style={styles.contactContainer}>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // Prevents FlatList scrolling
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleSelectContact(item)}
              >
                <Text style={styles.contactName}>{item.name}</Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                  <Text style={styles.contactNumber}>
                    {item.phoneNumbers[0].number}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        <Button title="Save Emergency Contacts" onPress={handleSaveContacts} />

        {selectedContacts.length > 0 && (
          <View style={styles.selectedContainer}>
            <Text style={styles.selectedHeader}>Selected Contacts:</Text>
            {selectedContacts.map((contact, index) => (
              <Text key={index} style={styles.selectedText}>
                {contact.name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginVertical: 10,
  },
  contactContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  contactNumber: {
    fontSize: 14,
    color: "#666",
  },
  noContactsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingVertical: 10,
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "#f44336",
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  selectedHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
  },
});
