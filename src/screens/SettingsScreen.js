import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Linking,
  TouchableOpacity
} from "react-native";
import Svg, { Circle, Path, } from "react-native-svg";

import { Switch } from "react-native-paper";
import { useLazyQuery, useMutation, useQuery, } from "@apollo/client";

// import { useUnionState } from "../../store/union-context";
// import { useUserState } from "../../store/user-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/header/Header";
import { SINGLE_USER } from "../../graph/queries/users";
import { OPTION_OUT } from "../../graph/mutations/notifications";
import { GET_UNION, GET_UNION_BY_NAME } from "../../graph/queries/unions";

export const SettingsScreen = ({ navigation, route }) => {
  const [userData, setUserData] = useState(null);
  const [unionData, setUnionData] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

        if (value !== null) {
          setUnionData(JSON.parse(value));
          // console.log('Retrieved data:', JSON.parse(value).information.imageURL);
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

  const [singleUserData, setSingleUserData] = useState([]);

  const [isSwitchOnUnionNot, setIsSwitchOnUnionNot] = useState(false);
  const [isSwitchOnCallDrops, setIsSwitchOnCallDrops] = useState(false);
  const [isSwitchOnTextMessages, setIsSwitchOnTextMessages] = useState(false);
  const [isSwitchOnEmails, setIsSwitchOnEmails] = useState(false);
  const [isSwitchOnPushNotifications, setIsSwitchOnPushNotifications] =
    useState(false);
  const [isSwitchOnRegistrationEmails, setIsSwitchOnRegistrationEmails] =
    useState(false);

  const {
    data: userInfo,
    error: errorUser,
    loading: loadingUser,
    refetch: refreshUser,
  } = useQuery(SINGLE_USER, {
    variables: { unionID: userData?.unionID, userID: userData?.id },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSingleUserData(data?.singleUser);

      setIsSwitchOnCallDrops(!data?.singleUser.callOpOut);
      setIsSwitchOnTextMessages(!data?.singleUser.textOpOut);
      setIsSwitchOnEmails(!data?.singleUser.emailOpOut);
      setIsSwitchOnPushNotifications(!data?.singleUser.pushOpOut);
      setRefreshing(false);
    },
    onError: (error) => {
      console.error(error); // eslint-disable-line
    },
  });

  const [unionInfo, setUnionInfo] = useState([]);

  const { loading, error, refetch: getUnion } = useQuery(GET_UNION, {
    variables: { unionID: unionData?.id },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setUnionInfo(data);
    },
    onError: (error) => {
      console.log(error);
    }
  });


  const [optionOut] = useMutation(OPTION_OUT, {
    onCompleted: () => {
      console.log("success");
    },
    onError: (error) => {
      console.error(error); // eslint-disable-line
    },
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshUser();
    getUnion();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  return (
    <SafeAreaView style={{
      flex: 1,
      width: "100%",
      backgroundColor: "#EAF1F5",
    }}>
      <View style={{ flex: 1 }}>
        <Header />
        {singleUserData.length === 0 || unionInfo.length === 0 ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <ScrollView style={{ paddingVertical: 10, paddingHorizontal: 15 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={styles.firstBlockWrapper}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#242529",
                  paddingHorizontal: 15,
                }}
              >
                Contacts
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#D9D9D9",
                  marginVertical: 15,
                }}
              ></View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Svg
                  width={26}
                  height={24}
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M11.9088 13.004C8.42655 9.50347 9.68659 8.21393 9.69487 8.20557L4.92065 13.0339C5.70907 14.2338 6.73507 15.5209 8.06958 16.863C9.41709 18.2183 10.741 19.2234 11.9963 19.9656L16.6807 15.2305C16.6807 15.2305 15.4017 16.5164 11.9088 13.0052V13.004Z"
                    fill="#34519A"
                  />
                  <Path
                    d="M16.4357 15.2762L16.4373 15.2746L16.9693 14.7598C16.9693 14.7598 16.9693 14.7598 16.9693 14.7598C17.9335 13.8265 19.4095 13.6519 20.6033 14.2839L20.6036 14.284L22.8316 15.4647C24.6446 16.4248 25.1111 18.8415 23.6198 20.2854L16.4357 15.2762ZM16.4357 15.2762L11.8125 19.7801L11.1464 20.429M16.4357 15.2762L11.1464 20.429M11.1464 20.429L11.9542 20.8896M11.1464 20.429L11.9542 20.8896M11.9542 20.8896C15.48 22.9001 18.4915 22.982 19.9925 22.8459L11.9542 20.8896ZM21.9633 21.8901L23.6197 20.2855L19.9925 22.8459C20.7937 22.7733 21.4585 22.3791 21.9633 21.8901C21.9633 21.8901 21.9633 21.8901 21.9633 21.8901ZM9.01806 2.36233L9.01796 2.36221C7.88562 0.889465 5.6805 0.667047 4.34338 1.96202C4.34332 1.96207 4.34327 1.96213 4.34321 1.96218L2.51181 3.73494L2.51181 3.73494L2.51079 3.73593C1.90928 4.32056 1.44117 5.14078 1.49722 6.10813L1.49725 6.10854C1.58001 7.52261 2.07032 10.0101 4.12453 13.026L4.59402 13.7153L5.19147 13.1334L9.90255 8.54511L9.90337 8.54432L10.2365 8.22095C10.2367 8.22073 10.2369 8.22052 10.2371 8.2203C11.3284 7.16409 11.4148 5.48084 10.488 4.27504C10.488 4.27503 10.488 4.27501 10.4879 4.275L9.01806 2.36233Z"
                    fill="#5783EF"
                    stroke="white"
                    strokeWidth="1.4"
                  />
                </Svg>
                <TouchableOpacity
                  style={{
                    width: "70%",
                    marginLeft: 10,
                  }}
                  onPress={() => Linking.openURL(`tel:${unionInfo?.singleUnion?.information?.phone}`)}>
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#242529",
                    }}
                  >
                    {unionInfo?.singleUnion?.information?.phone}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M22.3662 6.91113V16.7228C22.3663 17.516 22.0632 18.2793 21.519 18.8564C20.9748 19.4336 20.2307 19.7809 19.4388 19.8275L19.2563 19.8327H4.7436C3.95037 19.8327 3.18709 19.5296 2.60996 18.9854C2.03282 18.4413 1.68545 17.6971 1.63891 16.9052L1.63373 16.7228V6.91113L11.4246 13.4388L11.5449 13.5072C11.6866 13.5764 11.8423 13.6124 12 13.6124C12.1577 13.6124 12.3133 13.5764 12.4551 13.5072L12.5753 13.4388L22.3662 6.91113Z"
                    fill="#34519A"
                  />
                  <Path
                    d="M19.2563 4.16797C20.3759 4.16797 21.3576 4.75885 21.9049 5.64723L12 12.2505L2.095 5.64723C2.35491 5.22509 2.71201 4.87122 3.13651 4.61515C3.561 4.35909 4.04057 4.20825 4.53522 4.17523L4.74358 4.16797H19.2563Z"
                    fill="#5783EF"
                  />
                </Svg>
                <TouchableOpacity
                  style={{
                    width: "70%",
                    marginLeft: 10,
                  }}
                  onPress={() => Linking.openURL(`mailto:${unionInfo?.singleUnion?.information?.email}`)}>
                  <Text
                    style={{
                      width: "100%",
                      fontSize: 16,
                      fontWeight: "400",
                      color: "#242529",
                    }}
                  >
                    {unionInfo?.singleUnion?.information?.email}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M12 12C12.605 12 13.1231 11.7844 13.5543 11.3532C13.9855 10.922 14.2007 10.4043 14.2 9.8C14.2 9.195 13.9844 8.6769 13.5532 8.2457C13.122 7.8145 12.6043 7.59927 12 7.6C11.395 7.6 10.8769 7.8156 10.4457 8.2468C10.0145 8.678 9.79928 9.19573 9.80001 9.8C9.80001 10.405 10.0156 10.9231 10.4468 11.3543C10.878 11.7855 11.3957 12.0007 12 12ZM12 23C9.04835 20.4883 6.84395 18.1556 5.38681 16.0018C3.92968 13.848 3.20075 11.8541 3.20001 10.02C3.20001 7.27 4.08478 5.07917 5.85431 3.4475C7.62385 1.81583 9.67241 1 12 1C14.3283 1 16.3773 1.81583 18.1468 3.4475C19.9163 5.07917 20.8007 7.27 20.8 10.02C20.8 11.8533 20.0711 13.8473 18.6132 16.0018C17.1553 18.1563 14.9509 20.4891 12 23Z"
                    fill="#34519A"
                  />
                  <Circle
                    cx="12"
                    cy="9.8"
                    r="3.3"
                    fill="#5783EF"
                    stroke="white"
                    strokeWidth="1.4"
                  />
                </Svg>
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  {unionInfo?.singleUnion?.information?.address},{" "}
                  {unionInfo?.singleUnion?.information?.province}{" "}
                  {unionInfo?.singleUnion?.information?.postalCode}
                </Text>
              </View>
            </View>

            <View style={styles.firstBlockWrapper}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#242529",
                  paddingHorizontal: 15,
                }}
              >
                Union Notifications
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#D9D9D9",
                  marginVertical: 15,
                }}
              ></View>

              {/* <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#F4F4F4",
                borderStyle: "solid",
              }}
            >
              <Text
                style={{
                  width: "70%",
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#242529",
                  marginLeft: 10,
                }}
              >
                Union Notifications
              </Text>
              <Switch
                value={isSwitchOnUnionNot}
                onValueChange={() => setIsSwitchOnUnionNot(!isSwitchOnUnionNot)}
              />
            </View> */}

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  Allow call drops
                </Text>
                <Switch
                  value={isSwitchOnCallDrops}
                  onValueChange={() => {
                    optionOut({
                      variables: {
                        opOut: isSwitchOnCallDrops,
                        service: "call",
                        unionID: userData?.unionID,
                        userID: userData?.id,
                      },
                    });
                    setIsSwitchOnCallDrops(!isSwitchOnCallDrops);
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  Allow text messages
                </Text>
                <Switch
                  value={isSwitchOnTextMessages}
                  onValueChange={() => {
                    optionOut({
                      variables: {
                        opOut: isSwitchOnTextMessages,
                        service: "text",
                        unionID: userData?.unionID,
                        userID: userData?.id,
                      },
                    });
                    setIsSwitchOnTextMessages(!isSwitchOnTextMessages);
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  Allow emails
                </Text>
                <Switch
                  value={isSwitchOnEmails}
                  onValueChange={() => {
                    optionOut({
                      variables: {
                        opOut: isSwitchOnEmails,
                        service: "email",
                        unionID: userData?.unionID,
                        userID: userData?.id,
                      },
                    });
                    setIsSwitchOnEmails(!isSwitchOnEmails);
                  }}
                />
              </View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  Allow push notifications
                </Text>
                <Switch
                  value={isSwitchOnPushNotifications}
                  onValueChange={() => {
                    optionOut({
                      variables: {
                        opOut: isSwitchOnPushNotifications,
                        service: "push",
                        unionID: userData?.unionID,
                        userID: userData?.id,
                      },
                    });
                    setIsSwitchOnPushNotifications(!isSwitchOnPushNotifications);
                  }}
                />
              </View>

              {/* <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderBottomColor: "#F4F4F4",
                borderStyle: "solid",
              }}
            >
              <Text
                style={{
                  width: "70%",
                  fontSize: 16,
                  fontWeight: "400",
                  color: "#242529",
                  marginLeft: 10,
                }}
              >
                Allow registration emails
              </Text>
              <Switch
                value={isSwitchOnRegistrationEmails}
                onValueChange={() =>
                  setIsSwitchOnRegistrationEmails(!isSwitchOnRegistrationEmails)
                }
              />
            </View> */}
            </View>

            <View style={styles.firstBlockWrapper}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#242529",
                  paddingHorizontal: 15,
                }}
              >
                System settings
              </Text>

              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#D9D9D9",
                  marginVertical: 15,
                }}
              ></View>

              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#F4F4F4",
                  borderStyle: "solid",
                }}
              >
                <Text
                  style={{
                    width: "70%",
                    fontSize: 16,
                    fontWeight: "400",
                    color: "#242529",
                    marginLeft: 10,
                  }}
                >
                  Version - 1.4.1
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    padding: 30,
  },
  firstBlockWrapper: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingVertical: 18,
    shadowColor: "#4468C1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
});
