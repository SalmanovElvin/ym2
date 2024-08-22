import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS } from './../../../graph/queries/messages';
import { Chat } from "./Chat";

export const Chats = ({ navigation, route }) => {

    const readNotificationAll = () => {
        console.log('test');
    }

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
            //     <Svg fill="#228BE6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width={30} height={30}><Path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z" /></Svg>
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
                const allChats = data.chats;
                setChatsState(allChats);


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
        <SafeAreaView style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#EAF1F5",
        }}>
            <View style={styles.mainWrapper}>
                <FlatList
                    data={chatsState}
                    renderItem={({ item }) => (
                        <Chat chat={item} participants={item.participants} />
                    )}
                    keyExtractor={(item) => item?.id}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        minHeight: '100%'
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
