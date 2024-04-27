import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import { useUnionState } from "../../store/union-context";
import { useUserState } from "../../store/user-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header/Header";

export const ServicesScreen = ({ navigation, route }) => {
  const unionState = useUnionState();
  const userState = useUserState();

  const [userData, setUserData] = useState(null);

  const [logoURL, setLogoURL] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

        if (value !== null) {
          setLogoURL({ uri: `${JSON.parse(value).information.imageURL}` });
          // console.log('Retrieved data:', JSON.parse(value).information.imageURL);
        } else {
          console.log("No union data found");
        }

        const userVal = await AsyncStorage.getItem("@USER"); // Replace 'key' with your actual key

        if (userVal !== null && JSON.parse(userVal).username !== undefined) {
          setUserData(JSON.parse(userVal));
          // navigation.navigate('Home');
          // console.log(JSON.parse(userVal).username);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <Header from={route.name} />
      <View style={styles.center}>
        <Text>Services</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    padding: 10,
  },
});
