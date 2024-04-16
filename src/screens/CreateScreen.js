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
export const CreateScreen = ({ navigation, route }) => {
  const { signOutUserAnsStr } = route.params;

  return (
    <ScrollView style={styles.wrapper}>
      <Text
        onPress={() => {
          signOutUserAnsStr();
        }}
      >
        Close
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});
