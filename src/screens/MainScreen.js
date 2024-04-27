import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, SafeAreaView, ScrollView, RefreshControl } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";
import { useUnionState } from "../../store/union-context";
import { useUserState } from "../../store/user-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_NOTIFICATIONS } from "../../graph/queries/notifications";
import { useMutation, useQuery } from "@apollo/client";
import { Header } from "../components/header/Header";
// import { useRoute } from '@react-navigation/native';

export const MainScreen = ({ navigation, route }) => {
  // const routeFrom = useRoute();

  // const navigator = useNavigation();

  const unionState = useUnionState();

  const [userData, setUserData] = useState(useUserState());

  const [logoURL, setLogoURL] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

        if (value !== null) {
          setLogoURL({ uri: `${JSON.parse(value).information.imageURL}` });
        } else {
          console.log("No union data found");
        }

        const userVal = await AsyncStorage.getItem("@USER"); // Replace 'key' with your actual key

        if (userVal !== null && JSON.parse(userVal).username !== undefined) {
          setUserData(JSON.parse(userVal));
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);



  const [isNotifications, setIsNotifications] = useState(false);

  const { loading, error, data, refetch: getNotifications } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      unionID: userData?.unionID,
      userID: userData?.id,
    },
    onCompleted: () => {
      setRefreshing(false);
      for (let i = 0; i < data?.notifications?.length; i++) {
        if (data.notifications[i].read == false) {
          setIsNotifications(true);
        }
      }
    },
    onError: (err) => {
      console.log(err);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });


  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotifications();
  }, []);

  return (
    <>
      <Header  />
      <SafeAreaView style={styles.wrapper}>
        <ScrollView style={styles.wrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text>Hello {userData.username}</Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
  },
});
