import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS, GET_MESSAGES } from './../../../graph/queries/messages';

export const MessagesPage = ({ navigation, route }) => {

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
            <TouchableOpacity
                onPress={() => navigation.goBack()}
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
                    Chats
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

    const [lastMsg, setLastMsg] = useState([])

    // const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
    //     variables: {
    //         unionID: userData?.unionID,
    //         chatID: chat?.id,
    //     },
    //     onCompleted: () => {
    //         setLastMsg(data?.messages[data?.messages?.length - 1]);
    //     },
    //     notifyOnNetworkStatusChange: true,
    //     pollInterval: 5000,
    // });

    // console.log(chat);
    return (
        <TouchableOpacity activeOpacity={0.6} style={styles.wrapper}>
            <Text>Messages</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    wrapper: {
        position: 'relative',
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        shadowColor: "#4468c1",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.23,
        shadowRadius: 11.27,
        elevation: 5,
        borderRadius: 10,
        width: '100%',
        marginBottom: 15
        // borderLeftColor:'#4468C1',
        // borderLeftWidth:10
    },
});
