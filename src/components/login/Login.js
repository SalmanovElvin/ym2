import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useUnionState } from '../../../store/union-context'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({ navigation, route }) => {

  const { getAccess } = route.params;

  const openUnionLogin = () => {
    navigation.navigate("unionSignIn");
  };

  const unionState = useUnionState();
  let logoURL='';
  if(unionState!=null){
    // console.log(unionState.information.imageURL);
    logoURL=unionState.information.imageURL
		? {uri: `${unionState.information.imageURL}`}
		: require('../../../ios-icon.png');
    // console.log(logoURL);
  }

  //////////////////////////////////////////////////////////////////////

  //This is for using AsyncStorage

  // // Define the key
  // const UNION_KEY = 'UNION';

  // // Function to get item from AsyncStorage with UNION key
  // const getUnionItem = async () => {
  //   try {
  //     // Retrieve item from AsyncStorage
  //     const item = await AsyncStorage.getItem(UNION_KEY);

  //     const data = JSON.parse(item);

  //     // Access the id property
  //     const id = data.id;

  //     // Check if item exists
  //     if (item !== null) {
  //       // Item found, do something with it
  //       console.log(id);
  //     } else {
  //       // Item not found
  //       console.log('No item found with key:', UNION_KEY);
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //     console.error('Error getting item from AsyncStorage:', error);
  //   }
  // };

  // // Call the function to get item from AsyncStorage
  // getUnionItem();

//////////////////////////////////////////////////////////////////////////

  // State variable to hold the password
  const [password, setPassword] = useState("");

  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.mainContUnion}>
      <View>
      <Image
          style={{ width: 100, height: 100 }}
          source={logoURL}
        />
      </View>
      <View style={styles.mainFormUnion}>
        <Text style={styles.header}>Log into your account</Text>
        <TextInput style={styles.input} placeholder="Login" />
        <View style={styles.container}>
          <TextInput
            // Set secureTextEntry prop to hide
            //password when showPassword is false
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.inputP}
            placeholder="Password"
          />
          <MaterialCommunityIcons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#aaa"
            style={styles.icon}
            onPress={toggleShowPassword}
          />
        </View>
        <Text onPress={() => navigation.navigate('forgot')} style={styles.forgot}>Forgot password?</Text>

        <TouchableOpacity onPress={getAccess} activeOpacity={0.7} style={styles.conf}>
          <Text style={styles.btnConf}>
            Sign in
          </Text>
        </TouchableOpacity>

        <Text style={styles.create}>
          If you don’t have an account you can sign up{" "}
          <Text onPress={() => navigation.navigate('signUp')} style={styles.createHere}>Here</Text> .
        </Text>
      </View>
      <TouchableOpacity onPress={openUnionLogin} style={styles.changeUnion}>
        <Text style={styles.changeUnion}>Change Union</Text>
      </TouchableOpacity>
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
    borderWidth: "1px",
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
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16

  },
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: "1px",
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    fontSize: 16,
    margin: 10,
    paddingLeft: 24,
    borderRadius: 5,
  },
  inputP: {
    height: 56,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  forgot: {
    width: "100%",
    paddingHorizontal: 14,
    textAlign: "right",
    marginBottom: 20,
    color: "#0A93E1",
  },
  create: {
    width: "65%",
    textAlign: "center",
    margin: 10,
  },
  createHere: {
    color: "#0A93E1",
  },
  changeUnion: {
    marginTop: 30,
    color: "#34519A",
    textTransform: "capitalize",
    fontWeight: "700",
    lineHeight: 19.36,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
