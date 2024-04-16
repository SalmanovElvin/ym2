import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { PhotoPicker } from "../components/PhotoPicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const CreateScreen = ({ navigation }) => {
  const signOut = async () => {
    try {
      // Set the value for the specified key
      await AsyncStorage.setItem("@USER", 'null');
      console.log(`Value for key @USER changed successfully.`);
    } catch (error) {
      console.error("Error while changing AsyncStorage value:", error);
    }
  };
  return (
    <ScrollView style={styles.wrapper}>
      <Text onPress={signOut}>Yes</Text>
      {/* <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.wrapper}>
          <PhotoPicker />
        </View>
      </TouchableWithoutFeedback> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
  },
  textArea: {
    padding: 10,
    marginBottom: 10,
    // borderColor: 'grey',
    // borderWidth: 1,
  },
});
