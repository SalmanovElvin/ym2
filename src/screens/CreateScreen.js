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

export const CreateScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <Text>
        Yes
      </Text>
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
