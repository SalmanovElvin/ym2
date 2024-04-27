import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS } from './../../../graph/queries/messages';

export const Chats = ({ navigation, route }) => {
    const { fromScreen } = route.params;
    // console.log(fromScreen);

    navigation.setOptions({
        headerStyle: {
            backgroundColor: "#fff", // Change the color here
            shadowColor: "#000", // Shadow color
            shadowOffset: {
                width: 0,
                height: 2, // Shadow height
            },
            shadowOpacity: 0.25, // Shadow opacity
            shadowRadius: 3.84, // Shadow radius
            elevation: 5, // Elevation (for Android) // Change the color here
            alignItems: 'center',
            justifyContent: 'center'
        },
        headerRight: () => (
            <>
            </>
            // <TouchableOpacity onPress={readNotificationAll} activeOpacity={0.6} style={{ flexDirection: "row", marginRight: 10 }}>
            //     <Text style={{ color: '#0F3BAA', fontWeight: '600', fontSize: 16 }}>Read all</Text>
            // </TouchableOpacity>
        ),
        headerLeft: () => (
            // <Image style={{ width: 50, height: 35 }} source={logoURL} />
            <TouchableOpacity
                onPress={() => navigation.navigate(fromScreen)}
                activeOpacity={0.6}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Svg
                    width="8"
                    height="12"
                    viewBox="0 0 8 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Path
                        d="M6.5 1L1.5 6L6.5 11"
                        stroke="#242529"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </Svg>
                <Text
                    style={{
                        marginLeft: 15,
                        fontWeight: "700",
                        fontSize: 16,
                        color: "#242529",
                    }}
                >
                    Messages
                </Text>
            </TouchableOpacity>
        ),
    });


    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
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

    const [chatsState, setChatsState] = useState([]);
    //get data from backend using gql
    const { loading, error, data, refetch } = useQuery(GET_CHATS, {
        variables: {
            unionID: userData?.unionID,
            userID: userData?.id,
        },
        onCompleted: () => {
            if (data.chats) {
                setChatsState(data.chats);
                console.log(data.chats.participants);
            } else {
                setChatsState(null);
            }
        },
        onError: (err) => {
            console.log(err);
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 5000,
    });

    if (chatsState?.length == 0 && chatsState != null) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        )
    }

    if (chatsState == null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>
                    You don't have any chats...
                </Text>
            </View>

        )
    }

    return (
        <ScrollView style={styles.wrapper}>
            <Text>Chats</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        overflow: 'scroll'
    },
});
