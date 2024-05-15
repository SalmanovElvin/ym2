import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, SafeAreaView, ScrollView, RefreshControl } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";
import { useUnionState } from "../../../store/union-context";
import { useUserState } from "../../../store/user-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_NOTIFICATIONS } from "../../../graph/queries/notifications";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigation } from '@react-navigation/native';

export const Header = () => {
    const navigation = useNavigation();
    const unionState = useUnionState();

    const [userData, setUserData] = useState(useUserState());

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

    setInterval(() => {
        getNotifications();
    }, 1000);


    const [isNotifications, setIsNotifications] = useState(false);

    const { loading, error, data, refetch: getNotifications } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            unionID: userData?.unionID,
            userID: userData?.id,
        },
        onCompleted: () => {
            for (let i = 0; i < data?.notifications?.length; i++) {
                if (data.notifications[i].read == false) {
                    setIsNotifications(true);
                }
            }
            // console.log(data.notifications);
        },
        onError: (err) => {
            console.log(err);
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });




    return (
        <View style={styles.wrapper}>
            <Image style={{ width: 55, height: 40 }} source={logoURL} />
            <View style={{ flexDirection: "row" }}>
                {isNotifications ?
                    <Svg
                        onPress={() => navigation.navigate('Notifications')}
                        style={{ marginRight: 15 }}
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <Path
                            d="M23.3611 21.588C22.1684 20.0769 21.3263 19.3077 21.3263 15.1418C21.3263 11.3269 19.4442 9.96779 17.8951 9.30769C17.6894 9.22019 17.4957 9.01923 17.433 8.80048C17.1612 7.84327 16.3995 7 15.3869 7C14.3743 7 13.6121 7.84375 13.3432 8.80144C13.2805 9.0226 13.0868 9.22019 12.881 9.30769C11.3301 9.96875 9.44991 11.3231 9.44991 15.1418C9.44758 19.3077 8.60548 20.0769 7.41269 21.588C6.91848 22.2139 7.35138 23.1538 8.21578 23.1538H22.5627C23.4225 23.1538 23.8526 22.2111 23.3611 21.588Z"
                            stroke="#757881"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d="M17.4889 26.0988C18.0464 25.5218 18.3596 24.7391 18.3596 23.9231H12.4142C12.4142 24.7391 12.7274 25.5218 13.2849 26.0988C13.8424 26.6758 14.5985 27 15.3869 27C16.1753 27 16.9314 26.6758 17.4889 26.0988Z"
                            fill="#757881"
                            stroke="#757881"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Circle
                            cx="20.7955"
                            cy="9"
                            r="5"
                            fill="#ED1717"
                            stroke="#F9FAFC"
                            strokeWidth="2"
                        />
                    </Svg>
                    :
                    <Svg
                        onPress={() => navigation.navigate('Notifications')}
                        style={{ marginRight: 15 }}
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <Path
                            d="M23.3611 21.588C22.1684 20.0769 21.3263 19.3077 21.3263 15.1418C21.3263 11.3269 19.4442 9.96779 17.8951 9.30769C17.6894 9.22019 17.4957 9.01923 17.433 8.80048C17.1612 7.84327 16.3995 7 15.3869 7C14.3743 7 13.6121 7.84375 13.3432 8.80144C13.2805 9.0226 13.0868 9.22019 12.881 9.30769C11.3301 9.96875 9.44991 11.3231 9.44991 15.1418C9.44758 19.3077 8.60548 20.0769 7.41269 21.588C6.91848 22.2139 7.35138 23.1538 8.21578 23.1538H22.5627C23.4225 23.1538 23.8526 22.2111 23.3611 21.588Z"
                            stroke="#757881"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <Path
                            d="M17.4889 26.0988C18.0464 25.5218 18.3596 24.7391 18.3596 23.9231H12.4142C12.4142 24.7391 12.7274 25.5218 13.2849 26.0988C13.8424 26.6758 14.5985 27 15.3869 27C16.1753 27 16.9314 26.6758 17.4889 26.0988Z"
                            fill="#757881"
                            stroke="#757881"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>

                }


                <Svg
                    onPress={() => navigation.navigate('Chats')}
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Path
                        d="M18.2222 19.3334V21.5556C18.2222 21.8503 18.1052 22.1329 17.8968 22.3413C17.6884 22.5497 17.4058 22.6667 17.1111 22.6667H9.33333L6 26.0001V14.8889C6 14.5943 6.11706 14.3116 6.32544 14.1033C6.53381 13.8949 6.81643 13.7778 7.11111 13.7778H9.33333"
                        stroke="#757881"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <Path
                        d="M26 18.2222L22.6667 14.8889H14.8889C14.5942 14.8889 14.3116 14.7718 14.1032 14.5635C13.8948 14.3551 13.7778 14.0725 13.7778 13.7778V7.11111C13.7778 6.81643 13.8948 6.53381 14.1032 6.32544C14.3116 6.11706 14.5942 6 14.8889 6H24.8889C25.1836 6 25.4662 6.11706 25.6746 6.32544C25.8829 6.53381 26 6.81643 26 7.11111V18.2222Z"
                        fill="#757881"
                        stroke="#757881"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 35,
        paddingBottom: 5,
        backgroundColor: "#fff",
        shadowColor: "#000", // Shadow color
        shadowOffset: {
            width: 0,
            height: 2, // Shadow height
        },
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation (for Android) // Change the color here
    },
});
