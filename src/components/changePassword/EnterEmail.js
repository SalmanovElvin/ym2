import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useUnionState } from '../../../store/union-context';

export const EnterEmail = (props) => {
  // State variable to hold the password
  const [password, setPassword] = useState("");

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const unionState = useUnionState();
  let logoURL = '';
  if (unionState != null) {
    logoURL = unionState.information.imageURL
      ? { uri: `${unionState.information.imageURL}` }
      : require('../../../ios-icon.png');
  }
  return (
    <View style={styles.mainContUnion}>
      <View>
        <Image
          style={{ width: 100, height: 100 }}
          source={logoURL}
        />
      </View>
      <View style={styles.mainFormUnion}>
        <Text style={styles.header}>Enter your Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Personal Email"
          keyboardType="email-address"
        />

        <TouchableOpacity activeOpacity={0.7} style={styles.conf}>
          <Text style={styles.btnConf}>Request password reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContUnion: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#EAF1F5",
  },
  mainFormUnion: {
    width: "80%",
    alignItems: "center",
    margin: 45,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#4468c1",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23,
    shadowRadius: 11.27,
    elevation: 10,
  },
  header: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 24,
    margin: 10,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    height: 56,
    fontSize: 16,
    margin: 10,
    paddingLeft: 24,
  },
  conf: {
    width: "90%",
    backgroundColor: "#34519A",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
