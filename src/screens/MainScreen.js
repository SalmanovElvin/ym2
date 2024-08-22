import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from "react-native";

import { useUnionState } from "../../store/union-context";
import { useUserState } from "../../store/user-context";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect, Line } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { Header } from "../components/header/Header";
import { GET_GRIEVANCES } from "../../graph/queries/grievances";
import { LOGIN_WITH_TOKEN } from "../../graph/mutations/users";

// import { useRoute } from '@react-navigation/native';

export const MainScreen = ({ navigation, route }) => {

  const [tabs, setTabs] = useState([]);

  const [loginWithToken] = useMutation(LOGIN_WITH_TOKEN, {
    onCompleted: (dataOfUserByToken) => {
      setTabs(dataOfUserByToken.loginWithToken.union.infoTabs);
    },
    onError: (err) => {
      console.error('Login Error: ', err);
    }
  });

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
          loginWithToken({ variables: { token: JSON.parse(userVal).token, device: 'mobile' } });
          // console.log(JSON.parse(userVal).token);

        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    getData();
  }, []);



  const [grievances, setGrievances] = useState(null);


  //query
  const { data, loading, error, refetch } = useQuery(GET_GRIEVANCES, {
    variables: {
      unionID: userData?.unionID,
    },
    onCompleted: (data) => {
      setGrievances(true);
      setRefreshing(false);
    },
    onError: (err) => {
      setGrievances(false);
      setRefreshing(false);
      refetch();

    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  // const { loading, error, data, refetch: getNotifications } = useQuery(GET_NOTIFICATIONS, {
  //   variables: {
  //     unionID: userData?.unionID,
  //     userID: userData?.id,
  //   },
  //   onCompleted: () => {
  //     setRefreshing(false);
  //     for (let i = 0; i < data?.notifications?.length; i++) {
  //       if (data.notifications[i].read == false) {
  //         setIsNotifications(true);
  //       }
  //     }
  //   },
  //   onError: (err) => {
  //     console.log(err);
  //   },
  //   fetchPolicy: "cache-and-network",
  //   notifyOnNetworkStatusChange: true,
  // });


  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    loginWithToken({ variables: { token: userData?.token, device: 'mobile' } });
    // setTimeout(() => {
    // setRefreshing(false); 
    // }, 1000);

    // getNotifications();
  }, []);

  if (grievances === null) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <Header />

        <ScrollView style={styles.wrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >



          {tabs.map(item => {

            if (item.key.toLowerCase() == "documents") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Documents')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* See your */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* Documents here. */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 13.9996V20.9996C0 25.9504 -1.30385e-07 28.4249 1.53825 29.9631C1.918 30.3429 2.3555 30.6281 2.8735 30.8451C2.86179 30.7671 2.85071 30.6889 2.84025 30.6106C2.625 29.0041 2.625 27.0004 2.625 24.6729V10.3281C2.625 8.00063 2.625 5.99513 2.84025 4.39038L2.87525 4.15588C2.37519 4.35772 1.9206 4.65762 1.53825 5.03788C-1.30385e-07 6.57613 0 9.05063 0 13.9996ZM35 13.9996V20.9996C35 25.9504 35 28.4249 33.4618 29.9631C33.082 30.3429 32.6445 30.6281 32.1265 30.8451L32.1598 30.6106C32.375 29.0041 32.375 27.0004 32.375 24.6729V10.3281C32.375 8.00063 32.375 5.99513 32.1598 4.39038C32.1487 4.31212 32.137 4.23396 32.1248 4.15588C32.6445 4.37113 33.082 4.65813 33.4618 5.03788C35 6.57613 35 9.05063 35 13.9996Z" fill="#34519A" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M6.78825 1.53825C5.25 3.07475 5.25 5.551 5.25 10.5V24.5C5.25 29.449 5.25 31.9253 6.78825 33.4618C8.32475 35 10.801 35 15.75 35H19.25C24.199 35 26.6753 35 28.2118 33.4618C29.75 31.9253 29.75 29.449 29.75 24.5V10.5C29.75 5.551 29.75 3.07475 28.2118 1.53825C26.6753 -1.04308e-07 24.199 0 19.25 0H15.75C10.801 0 8.32475 -1.04308e-07 6.78825 1.53825ZM10.9375 26.25C10.9375 25.9019 11.0758 25.5681 11.3219 25.3219C11.5681 25.0758 11.9019 24.9375 12.25 24.9375H17.5C17.8481 24.9375 18.1819 25.0758 18.4281 25.3219C18.6742 25.5681 18.8125 25.9019 18.8125 26.25C18.8125 26.5981 18.6742 26.9319 18.4281 27.1781C18.1819 27.4242 17.8481 27.5625 17.5 27.5625H12.25C11.9019 27.5625 11.5681 27.4242 11.3219 27.1781C11.0758 26.9319 10.9375 26.5981 10.9375 26.25ZM12.25 17.9375C11.9019 17.9375 11.5681 18.0758 11.3219 18.3219C11.0758 18.5681 10.9375 18.9019 10.9375 19.25C10.9375 19.5981 11.0758 19.9319 11.3219 20.1781C11.5681 20.4242 11.9019 20.5625 12.25 20.5625H22.75C23.0981 20.5625 23.4319 20.4242 23.6781 20.1781C23.9242 19.9319 24.0625 19.5981 24.0625 19.25C24.0625 18.9019 23.9242 18.5681 23.6781 18.3219C23.4319 18.0758 23.0981 17.9375 22.75 17.9375H12.25ZM10.9375 12.25C10.9375 11.9019 11.0758 11.5681 11.3219 11.3219C11.5681 11.0758 11.9019 10.9375 12.25 10.9375H22.75C23.0981 10.9375 23.4319 11.0758 23.6781 11.3219C23.9242 11.5681 24.0625 11.9019 24.0625 12.25C24.0625 12.5981 23.9242 12.9319 23.6781 13.1781C23.4319 13.4242 23.0981 13.5625 22.75 13.5625H12.25C11.9019 13.5625 11.5681 13.4242 11.3219 13.1781C11.0758 12.9319 10.9375 12.5981 10.9375 12.25Z" fill="#5783EF" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "executive") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Executives')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find executives */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here. */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Circle cx="16.6543" cy="8.5" r="8.5" fill="#5783EF" />
                        <Rect x="0.154297" y="20" width="33" height="16" rx="8" fill="#34519A" />
                        <Path d="M16.6543 33L9.1543 20L24.1543 20L16.6543 33Z" fill="#DBDDE6" />
                        <Path d="M15.6543 20H17.6543L18.1447 27.5957C18.151 27.6923 18.1291 27.7886 18.0816 27.873L16.7414 30.2569C16.7032 30.3249 16.6053 30.3249 16.5671 30.2569L15.227 27.873C15.1795 27.7886 15.1576 27.6923 15.1639 27.5957L15.6543 20Z" fill="#34519A" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "executive_second") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Executives2')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find executives */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here. */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Circle cx="16.6543" cy="8.5" r="8.5" fill="#5783EF" />
                        <Rect x="0.154297" y="20" width="33" height="16" rx="8" fill="#34519A" />
                        <Path d="M16.6543 33L9.1543 20L24.1543 20L16.6543 33Z" fill="#DBDDE6" />
                        <Path d="M15.6543 20H17.6543L18.1447 27.5957C18.151 27.6923 18.1291 27.7886 18.0816 27.873L16.7414 30.2569C16.7032 30.3249 16.6053 30.3249 16.5671 30.2569L15.227 27.873C15.1795 27.7886 15.1576 27.6923 15.1639 27.5957L15.6543 20Z" fill="#34519A" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "retirees") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('DocumentsOfRetirees')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* See documents */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* of retirees */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 13.9996V20.9996C0 25.9504 -1.30385e-07 28.4249 1.53825 29.9631C1.918 30.3429 2.3555 30.6281 2.8735 30.8451C2.86179 30.7671 2.85071 30.6889 2.84025 30.6106C2.625 29.0041 2.625 27.0004 2.625 24.6729V10.3281C2.625 8.00063 2.625 5.99513 2.84025 4.39038L2.87525 4.15588C2.37519 4.35772 1.9206 4.65762 1.53825 5.03788C-1.30385e-07 6.57613 0 9.05063 0 13.9996ZM35 13.9996V20.9996C35 25.9504 35 28.4249 33.4618 29.9631C33.082 30.3429 32.6445 30.6281 32.1265 30.8451L32.1598 30.6106C32.375 29.0041 32.375 27.0004 32.375 24.6729V10.3281C32.375 8.00063 32.375 5.99513 32.1598 4.39038C32.1487 4.31212 32.137 4.23396 32.1248 4.15588C32.6445 4.37113 33.082 4.65813 33.4618 5.03788C35 6.57613 35 9.05063 35 13.9996Z" fill="#34519A" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M6.78825 1.53825C5.25 3.07475 5.25 5.551 5.25 10.5V24.5C5.25 29.449 5.25 31.9253 6.78825 33.4618C8.32475 35 10.801 35 15.75 35H19.25C24.199 35 26.6753 35 28.2118 33.4618C29.75 31.9253 29.75 29.449 29.75 24.5V10.5C29.75 5.551 29.75 3.07475 28.2118 1.53825C26.6753 -1.04308e-07 24.199 0 19.25 0H15.75C10.801 0 8.32475 -1.04308e-07 6.78825 1.53825ZM10.9375 26.25C10.9375 25.9019 11.0758 25.5681 11.3219 25.3219C11.5681 25.0758 11.9019 24.9375 12.25 24.9375H17.5C17.8481 24.9375 18.1819 25.0758 18.4281 25.3219C18.6742 25.5681 18.8125 25.9019 18.8125 26.25C18.8125 26.5981 18.6742 26.9319 18.4281 27.1781C18.1819 27.4242 17.8481 27.5625 17.5 27.5625H12.25C11.9019 27.5625 11.5681 27.4242 11.3219 27.1781C11.0758 26.9319 10.9375 26.5981 10.9375 26.25ZM12.25 17.9375C11.9019 17.9375 11.5681 18.0758 11.3219 18.3219C11.0758 18.5681 10.9375 18.9019 10.9375 19.25C10.9375 19.5981 11.0758 19.9319 11.3219 20.1781C11.5681 20.4242 11.9019 20.5625 12.25 20.5625H22.75C23.0981 20.5625 23.4319 20.4242 23.6781 20.1781C23.9242 19.9319 24.0625 19.5981 24.0625 19.25C24.0625 18.9019 23.9242 18.5681 23.6781 18.3219C23.4319 18.0758 23.0981 17.9375 22.75 17.9375H12.25ZM10.9375 12.25C10.9375 11.9019 11.0758 11.5681 11.3219 11.3219C11.5681 11.0758 11.9019 10.9375 12.25 10.9375H22.75C23.0981 10.9375 23.4319 11.0758 23.6781 11.3219C23.9242 11.5681 24.0625 11.9019 24.0625 12.25C24.0625 12.5981 23.9242 12.9319 23.6781 13.1781C23.4319 13.4242 23.0981 13.5625 22.75 13.5625H12.25C11.9019 13.5625 11.5681 13.4242 11.3219 13.1781C11.0758 12.9319 10.9375 12.5981 10.9375 12.25Z" fill="#5783EF" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "standingcommittee") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Stewards')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find stewards */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Circle cx="16.6543" cy="8.5" r="8.5" fill="#5783EF" />
                        <Rect x="0.154297" y="20" width="33" height="16" rx="8" fill="#34519A" />
                        <Path d="M16.6543 33L9.1543 20L24.1543 20L16.6543 33Z" fill="#DBDDE6" />
                        <Path d="M15.6543 20H17.6543L18.1447 27.5957C18.151 27.6923 18.1291 27.7886 18.0816 27.873L16.7414 30.2569C16.7032 30.3249 16.6053 30.3249 16.5671 30.2569L15.227 27.873C15.1795 27.7886 15.1576 27.6923 15.1639 27.5957L15.6543 20Z" fill="#34519A" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "standingcommittee_second") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Stewards2')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find stewards */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="34" height="36" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Circle cx="16.6543" cy="8.5" r="8.5" fill="#5783EF" />
                        <Rect x="0.154297" y="20" width="33" height="16" rx="8" fill="#34519A" />
                        <Path d="M16.6543 33L9.1543 20L24.1543 20L16.6543 33Z" fill="#DBDDE6" />
                        <Path d="M15.6543 20H17.6543L18.1447 27.5957C18.151 27.6923 18.1291 27.7886 18.0816 27.873L16.7414 30.2569C16.7032 30.3249 16.6053 30.3249 16.5671 30.2569L15.227 27.873C15.1795 27.7886 15.1576 27.6923 15.1639 27.5957L15.6543 20Z" fill="#34519A" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "memorium") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Memorium')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find memorium */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 13.9996V20.9996C0 25.9504 -1.30385e-07 28.4249 1.53825 29.9631C1.918 30.3429 2.3555 30.6281 2.8735 30.8451C2.86179 30.7671 2.85071 30.6889 2.84025 30.6106C2.625 29.0041 2.625 27.0004 2.625 24.6729V10.3281C2.625 8.00063 2.625 5.99513 2.84025 4.39038L2.87525 4.15588C2.37519 4.35772 1.9206 4.65762 1.53825 5.03788C-1.30385e-07 6.57613 0 9.05063 0 13.9996ZM35 13.9996V20.9996C35 25.9504 35 28.4249 33.4618 29.9631C33.082 30.3429 32.6445 30.6281 32.1265 30.8451L32.1598 30.6106C32.375 29.0041 32.375 27.0004 32.375 24.6729V10.3281C32.375 8.00063 32.375 5.99513 32.1598 4.39038C32.1487 4.31212 32.137 4.23396 32.1248 4.15588C32.6445 4.37113 33.082 4.65813 33.4618 5.03788C35 6.57613 35 9.05063 35 13.9996Z" fill="#34519A" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M6.78825 1.53825C5.25 3.07475 5.25 5.551 5.25 10.5V24.5C5.25 29.449 5.25 31.9253 6.78825 33.4618C8.32475 35 10.801 35 15.75 35H19.25C24.199 35 26.6753 35 28.2118 33.4618C29.75 31.9253 29.75 29.449 29.75 24.5V10.5C29.75 5.551 29.75 3.07475 28.2118 1.53825C26.6753 -1.04308e-07 24.199 0 19.25 0H15.75C10.801 0 8.32475 -1.04308e-07 6.78825 1.53825ZM10.9375 26.25C10.9375 25.9019 11.0758 25.5681 11.3219 25.3219C11.5681 25.0758 11.9019 24.9375 12.25 24.9375H17.5C17.8481 24.9375 18.1819 25.0758 18.4281 25.3219C18.6742 25.5681 18.8125 25.9019 18.8125 26.25C18.8125 26.5981 18.6742 26.9319 18.4281 27.1781C18.1819 27.4242 17.8481 27.5625 17.5 27.5625H12.25C11.9019 27.5625 11.5681 27.4242 11.3219 27.1781C11.0758 26.9319 10.9375 26.5981 10.9375 26.25ZM12.25 17.9375C11.9019 17.9375 11.5681 18.0758 11.3219 18.3219C11.0758 18.5681 10.9375 18.9019 10.9375 19.25C10.9375 19.5981 11.0758 19.9319 11.3219 20.1781C11.5681 20.4242 11.9019 20.5625 12.25 20.5625H22.75C23.0981 20.5625 23.4319 20.4242 23.6781 20.1781C23.9242 19.9319 24.0625 19.5981 24.0625 19.25C24.0625 18.9019 23.9242 18.5681 23.6781 18.3219C23.4319 18.0758 23.0981 17.9375 22.75 17.9375H12.25ZM10.9375 12.25C10.9375 11.9019 11.0758 11.5681 11.3219 11.3219C11.5681 11.0758 11.9019 10.9375 12.25 10.9375H22.75C23.0981 10.9375 23.4319 11.0758 23.6781 11.3219C23.9242 11.5681 24.0625 11.9019 24.0625 12.25C24.0625 12.5981 23.9242 12.9319 23.6781 13.1781C23.4319 13.4242 23.0981 13.5625 22.75 13.5625H12.25C11.9019 13.5625 11.5681 13.4242 11.3219 13.1781C11.0758 12.9319 10.9375 12.5981 10.9375 12.25Z" fill="#5783EF" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

            if (item.key.toLowerCase() == "home_second") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Home2')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find memorium */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 13.9996V20.9996C0 25.9504 -1.30385e-07 28.4249 1.53825 29.9631C1.918 30.3429 2.3555 30.6281 2.8735 30.8451C2.86179 30.7671 2.85071 30.6889 2.84025 30.6106C2.625 29.0041 2.625 27.0004 2.625 24.6729V10.3281C2.625 8.00063 2.625 5.99513 2.84025 4.39038L2.87525 4.15588C2.37519 4.35772 1.9206 4.65762 1.53825 5.03788C-1.30385e-07 6.57613 0 9.05063 0 13.9996ZM35 13.9996V20.9996C35 25.9504 35 28.4249 33.4618 29.9631C33.082 30.3429 32.6445 30.6281 32.1265 30.8451L32.1598 30.6106C32.375 29.0041 32.375 27.0004 32.375 24.6729V10.3281C32.375 8.00063 32.375 5.99513 32.1598 4.39038C32.1487 4.31212 32.137 4.23396 32.1248 4.15588C32.6445 4.37113 33.082 4.65813 33.4618 5.03788C35 6.57613 35 9.05063 35 13.9996Z" fill="#34519A" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M6.78825 1.53825C5.25 3.07475 5.25 5.551 5.25 10.5V24.5C5.25 29.449 5.25 31.9253 6.78825 33.4618C8.32475 35 10.801 35 15.75 35H19.25C24.199 35 26.6753 35 28.2118 33.4618C29.75 31.9253 29.75 29.449 29.75 24.5V10.5C29.75 5.551 29.75 3.07475 28.2118 1.53825C26.6753 -1.04308e-07 24.199 0 19.25 0H15.75C10.801 0 8.32475 -1.04308e-07 6.78825 1.53825ZM10.9375 26.25C10.9375 25.9019 11.0758 25.5681 11.3219 25.3219C11.5681 25.0758 11.9019 24.9375 12.25 24.9375H17.5C17.8481 24.9375 18.1819 25.0758 18.4281 25.3219C18.6742 25.5681 18.8125 25.9019 18.8125 26.25C18.8125 26.5981 18.6742 26.9319 18.4281 27.1781C18.1819 27.4242 17.8481 27.5625 17.5 27.5625H12.25C11.9019 27.5625 11.5681 27.4242 11.3219 27.1781C11.0758 26.9319 10.9375 26.5981 10.9375 26.25ZM12.25 17.9375C11.9019 17.9375 11.5681 18.0758 11.3219 18.3219C11.0758 18.5681 10.9375 18.9019 10.9375 19.25C10.9375 19.5981 11.0758 19.9319 11.3219 20.1781C11.5681 20.4242 11.9019 20.5625 12.25 20.5625H22.75C23.0981 20.5625 23.4319 20.4242 23.6781 20.1781C23.9242 19.9319 24.0625 19.5981 24.0625 19.25C24.0625 18.9019 23.9242 18.5681 23.6781 18.3219C23.4319 18.0758 23.0981 17.9375 22.75 17.9375H12.25ZM10.9375 12.25C10.9375 11.9019 11.0758 11.5681 11.3219 11.3219C11.5681 11.0758 11.9019 10.9375 12.25 10.9375H22.75C23.0981 10.9375 23.4319 11.0758 23.6781 11.3219C23.9242 11.5681 24.0625 11.9019 24.0625 12.25C24.0625 12.5981 23.9242 12.9319 23.6781 13.1781C23.4319 13.4242 23.0981 13.5625 22.75 13.5625H12.25C11.9019 13.5625 11.5681 13.4242 11.3219 13.1781C11.0758 12.9319 10.9375 12.5981 10.9375 12.25Z" fill="#5783EF" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }


            if (item.key.toLowerCase() == "memorium_second") {
              if (item.display == true) {
                return (
                  <TouchableOpacity key={item.key} onPress={() => navigation.navigate('Memorium2')} activeOpacity={0.6} style={styles.block}>
                    <Text style={styles.firstTxt}>{item.title.toUpperCase()}</Text>
                    <Text style={styles.txt}>
                      {/* Find memorium */}
                    </Text>
                    <Text style={styles.txt}>
                      {/* here */}
                    </Text>
                    <View style={styles.iconWrapper}>
                      <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M0 13.9996V20.9996C0 25.9504 -1.30385e-07 28.4249 1.53825 29.9631C1.918 30.3429 2.3555 30.6281 2.8735 30.8451C2.86179 30.7671 2.85071 30.6889 2.84025 30.6106C2.625 29.0041 2.625 27.0004 2.625 24.6729V10.3281C2.625 8.00063 2.625 5.99513 2.84025 4.39038L2.87525 4.15588C2.37519 4.35772 1.9206 4.65762 1.53825 5.03788C-1.30385e-07 6.57613 0 9.05063 0 13.9996ZM35 13.9996V20.9996C35 25.9504 35 28.4249 33.4618 29.9631C33.082 30.3429 32.6445 30.6281 32.1265 30.8451L32.1598 30.6106C32.375 29.0041 32.375 27.0004 32.375 24.6729V10.3281C32.375 8.00063 32.375 5.99513 32.1598 4.39038C32.1487 4.31212 32.137 4.23396 32.1248 4.15588C32.6445 4.37113 33.082 4.65813 33.4618 5.03788C35 6.57613 35 9.05063 35 13.9996Z" fill="#34519A" />
                        <Path fillRule="evenodd" clipRule="evenodd" d="M6.78825 1.53825C5.25 3.07475 5.25 5.551 5.25 10.5V24.5C5.25 29.449 5.25 31.9253 6.78825 33.4618C8.32475 35 10.801 35 15.75 35H19.25C24.199 35 26.6753 35 28.2118 33.4618C29.75 31.9253 29.75 29.449 29.75 24.5V10.5C29.75 5.551 29.75 3.07475 28.2118 1.53825C26.6753 -1.04308e-07 24.199 0 19.25 0H15.75C10.801 0 8.32475 -1.04308e-07 6.78825 1.53825ZM10.9375 26.25C10.9375 25.9019 11.0758 25.5681 11.3219 25.3219C11.5681 25.0758 11.9019 24.9375 12.25 24.9375H17.5C17.8481 24.9375 18.1819 25.0758 18.4281 25.3219C18.6742 25.5681 18.8125 25.9019 18.8125 26.25C18.8125 26.5981 18.6742 26.9319 18.4281 27.1781C18.1819 27.4242 17.8481 27.5625 17.5 27.5625H12.25C11.9019 27.5625 11.5681 27.4242 11.3219 27.1781C11.0758 26.9319 10.9375 26.5981 10.9375 26.25ZM12.25 17.9375C11.9019 17.9375 11.5681 18.0758 11.3219 18.3219C11.0758 18.5681 10.9375 18.9019 10.9375 19.25C10.9375 19.5981 11.0758 19.9319 11.3219 20.1781C11.5681 20.4242 11.9019 20.5625 12.25 20.5625H22.75C23.0981 20.5625 23.4319 20.4242 23.6781 20.1781C23.9242 19.9319 24.0625 19.5981 24.0625 19.25C24.0625 18.9019 23.9242 18.5681 23.6781 18.3219C23.4319 18.0758 23.0981 17.9375 22.75 17.9375H12.25ZM10.9375 12.25C10.9375 11.9019 11.0758 11.5681 11.3219 11.3219C11.5681 11.0758 11.9019 10.9375 12.25 10.9375H22.75C23.0981 10.9375 23.4319 11.0758 23.6781 11.3219C23.9242 11.5681 24.0625 11.9019 24.0625 12.25C24.0625 12.5981 23.9242 12.9319 23.6781 13.1781C23.4319 13.4242 23.0981 13.5625 22.75 13.5625H12.25C11.9019 13.5625 11.5681 13.4242 11.3219 13.1781C11.0758 12.9319 10.9375 12.5981 10.9375 12.25Z" fill="#5783EF" />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                )

              }
            }

          })}




          <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.6} style={styles.block}>
            <Text style={styles.firstTxt}>PROFILE</Text>
            <Text style={styles.txt}>Manage your </Text>
            <Text style={styles.txt}>profile from here.</Text>
            <View style={styles.iconWrapper}>
              <Svg width="33" height="36" viewBox="0 0 33 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Circle cx="16.5" cy="8.5" r="8.5" fill="#5783EF" />
                <Rect y="20" width="33" height="16" rx="8" fill="#34519A" />
              </Svg>
            </View>
          </TouchableOpacity>


          {/* {grievances ? */}
          <TouchableOpacity onPress={() => navigation.navigate('Grievances')} activeOpacity={0.6} style={styles.block}>
            <Text style={styles.firstTxt}>GRIEVANCES</Text>
            <Text style={styles.txt}>See grievances </Text>
            <Text style={styles.txt}>here..</Text>
            <View style={styles.iconWrapper}>
              <Svg width="46" height="39" viewBox="0 0 46 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M12.1216 37.6261C11.7227 38.088 11.0068 38.088 10.6079 37.6261L6.09815 32.4043L16.6313 32.4043L12.1216 37.6261Z" fill="#34519A" />
                <Rect y="7.45679" width="38.8065" height="26.0558" rx="4" fill="#5783EF" />
                <Line x1="7.09814" y1="15.1536" x2="19.512" y2="15.1536" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" />
                <Line x1="7.09814" y1="20.4653" x2="16.7401" y2="20.4653" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" />
                <Line x1="7.09814" y1="25.7773" x2="23.947" y2="25.7773" stroke="#F8F8F8" strokeWidth="2" strokeLinecap="round" />
                <Path d="M43.4325 2.4044C41.7858 0.757653 39.1158 0.757657 37.4691 2.40441L27.3238 12.5497C27.1184 12.7552 27.0029 13.0338 27.0029 13.3243C27.0029 13.3244 27.0029 13.3244 27.0029 13.3244L27.0029 16.834C27.0029 17.9386 27.8983 18.834 29.0029 18.834L32.5125 18.834C32.5125 18.834 32.5126 18.834 32.5126 18.834C32.8031 18.834 33.0818 18.7186 33.2872 18.5131L43.4325 8.36781C45.0793 6.72106 45.0793 4.05115 43.4325 2.4044Z" fill="#34519A" stroke="#F8F8F8" stroke-width="2" />
              </Svg>
            </View>
          </TouchableOpacity>
          {/* :
            <></>
          } */}


          <TouchableOpacity onPress={() => navigation.navigate('Perks')} activeOpacity={0.6} style={styles.block}>
            <Text style={styles.firstTxt}>PERKS</Text>
            <Text style={styles.txt}>Check out the </Text>
            <Text style={styles.txt}>available perks..</Text>
            <View style={styles.iconWrapper}>
              <Svg width="44" height="38" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M13.7849 13.6215C13.7849 12.0653 14.4067 10.5728 15.5135 9.47245C16.6204 8.37206 18.1216 7.75387 19.6869 7.75387C21.6435 7.75387 23.52 8.52661 24.9036 9.9021C26.2872 11.2776 27.0644 13.1431 27.0644 15.0884C27.0644 17.4227 26.1317 19.6613 24.4714 21.3119C22.8112 22.9625 20.5594 23.8898 18.2114 23.8898C17.8201 23.8898 17.4448 24.0443 17.1681 24.3194C16.8913 24.5945 16.7359 24.9676 16.7359 25.3567C16.7359 25.7457 16.8913 26.1188 17.1681 26.3939C17.4448 26.669 17.8201 26.8236 18.2114 26.8236C21.342 26.8236 24.3444 25.5872 26.5581 23.3864C28.7718 21.1856 30.0154 18.2007 30.0154 15.0884C30.0154 9.41636 25.3922 4.82007 19.6869 4.82007C17.3389 4.82007 15.0871 5.74736 13.4269 7.39794C11.7666 9.04852 10.8339 11.2872 10.8339 13.6215C10.8339 15.5667 11.6111 17.4323 12.9947 18.8078C14.3782 20.1832 16.2548 20.956 18.2114 20.956C19.7767 20.956 21.2779 20.3378 22.3848 19.2374C23.4916 18.137 24.1134 16.6446 24.1134 15.0884C24.1134 13.9212 23.6471 12.8019 22.8169 11.9766C21.9868 11.1513 20.8609 10.6877 19.6869 10.6877C18.9042 10.6877 18.1536 10.9968 17.6002 11.547C17.0468 12.0972 16.7359 12.8434 16.7359 13.6215C16.7359 14.0105 16.8913 14.3836 17.1681 14.6587C17.4448 14.9338 17.8201 15.0884 18.2114 15.0884C18.6027 15.0884 18.978 14.9338 19.2547 14.6587C19.5314 14.3836 19.6869 14.0105 19.6869 13.6215C20.0782 13.6215 20.4535 13.776 20.7302 14.0511C21.007 14.3262 21.1624 14.6993 21.1624 15.0884C21.1624 15.8665 20.8515 16.6127 20.2981 17.1629C19.7447 17.7131 18.9941 18.0222 18.2114 18.0222C17.0374 18.0222 15.9115 17.5585 15.0814 16.7332C14.2512 15.908 13.7849 14.7886 13.7849 13.6215Z" fill="#5783EF" />
                <Path d="M31.491 1.95587C31.491 2.4746 31.2837 2.97208 30.9147 3.33888C30.5458 3.70567 30.0454 3.91174 29.5236 3.91174C29.0018 3.91174 28.5014 3.70567 28.1325 3.33888C27.7635 2.97208 27.5563 2.4746 27.5563 1.95587C27.5563 1.43714 27.7635 0.939657 28.1325 0.57286C28.5014 0.206064 29.0018 0 29.5236 0C30.0454 0 30.5458 0.206064 30.9147 0.57286C31.2837 0.939657 31.491 1.43714 31.491 1.95587ZM37.8848 5.8676C37.8848 5.47856 37.7294 5.10545 37.4527 4.83035C37.1759 4.55525 36.8006 4.4007 36.4093 4.4007C36.018 4.4007 35.6427 4.55525 35.366 4.83035C35.0893 5.10545 34.9338 5.47856 34.9338 5.8676V7.33451H33.4583C33.067 7.33451 32.6917 7.48905 32.415 7.76415C32.1382 8.03925 31.9828 8.41236 31.9828 8.80141C31.9828 9.19045 32.1382 9.56357 32.415 9.83866C32.6917 10.1138 33.067 10.2683 33.4583 10.2683H34.9338V11.7352C34.9338 12.1243 35.0893 12.4974 35.366 12.7725C35.6427 13.0476 36.018 13.2021 36.4093 13.2021C36.8006 13.2021 37.1759 13.0476 37.4527 12.7725C37.7294 12.4974 37.8848 12.1243 37.8848 11.7352V10.2683H39.3603C39.7517 10.2683 40.127 10.1138 40.4037 9.83866C40.6804 9.56357 40.8358 9.19045 40.8358 8.80141C40.8358 8.41236 40.6804 8.03925 40.4037 7.76415C40.127 7.48905 39.7517 7.33451 39.3603 7.33451H37.8848V5.8676Z" fill="#DBDDE6" />
                <Path d="M16.0788 22.5996C15.5171 23.0401 15.1073 23.6437 14.9065 24.3264C14.7057 25.0091 14.7239 25.737 14.9584 26.409C15.193 27.081 15.6323 27.6636 16.2152 28.076C16.7982 28.4883 17.4959 28.7098 18.2114 28.7097C21.265 28.7097 24.232 27.7011 26.6464 25.8425C29.0607 23.9839 30.7856 21.3805 31.55 18.4414H34.4282C35.6912 18.4414 36.9248 18.813 37.9753 19.5093L42.6379 22.5996C42.8015 22.7054 42.9423 22.8424 43.0522 23.0027C43.1621 23.163 43.2389 23.3434 43.2782 23.5334C43.3176 23.7234 43.3186 23.9193 43.2812 24.1097C43.2439 24.3001 43.1689 24.4813 43.0607 24.6427C42.9525 24.8041 42.8131 24.9426 42.6507 25.0501C42.4882 25.1576 42.306 25.232 42.1144 25.269C41.9229 25.306 41.7258 25.3048 41.5347 25.2656C41.3436 25.2264 41.1623 25.1499 41.0011 25.0405L37.393 22.6485V31.6435C37.393 32.4783 37.2276 33.3049 36.9063 34.0761C36.585 34.8473 36.114 35.548 35.5203 36.1383C34.9265 36.7286 34.2217 37.1968 33.4459 37.5162C32.6702 37.8357 31.8388 38.0001 30.9991 38.0001H12.3094C11.4697 38.0001 10.6383 37.8357 9.86256 37.5162C9.08682 37.1968 8.38197 36.7286 7.78824 36.1383C7.19452 35.548 6.72355 34.8473 6.40223 34.0761C6.08091 33.3049 5.91552 32.4783 5.91552 31.6435V22.6485L2.30742 25.0405C2.14626 25.1499 1.96488 25.2264 1.77378 25.2656C1.58267 25.3048 1.38564 25.306 1.19409 25.269C1.00254 25.232 0.820279 25.1576 0.657849 25.0501C0.495419 24.9426 0.35605 24.8041 0.247811 24.6427C0.139571 24.4813 0.0646112 24.3001 0.0272695 24.1097C-0.0100722 23.9193 -0.00905372 23.7234 0.030266 23.5334C0.0695858 23.3434 0.146426 23.163 0.256338 23.0027C0.36625 22.8424 0.507051 22.7054 0.67059 22.5996L5.33319 19.5093C6.38358 18.813 7.61782 18.4414 8.88031 18.4414H10.2633C10.9106 19.4802 11.7572 20.3821 12.7551 21.0956C13.7529 21.809 14.8823 22.3201 16.0788 22.5996Z" fill="#34519A" />
              </Svg>
            </View>
          </TouchableOpacity>


        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  block: {
    backgroundColor: '#E5E7ED',
    borderRadius: 20,
    padding: 32,
    marginBottom: 18,
    marginTop: 18,
    marginHorizontal: 15,
    shadowColor: "#4468c1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 11.27,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden'
  },
  firstTxt: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24.2,
    color: '#242529',
    marginBottom: 10
  },
  txt: {
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 16.94,
    color: '#4E4E4E'
  },
  iconWrapper: {
    height: 110,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 57,
    position: 'absolute',
    right: -15,
    bottom: -15
  },
});
