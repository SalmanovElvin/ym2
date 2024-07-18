import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, RefreshControl } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { Notification } from "./Notification";
import { GET_NOTIFICATIONS } from "../../../graph/queries/notifications";
import { READ_NOTIFICATION_ALL } from "../../../graph/mutations/notifications";


export const NotificationsPage = ({ navigation, route }) => {
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
            <TouchableOpacity onPress={readNotificationAll} activeOpacity={0.6} style={{ flexDirection: "row", marginRight: 10 }}>
                <Text style={{ color: '#0F3BAA', fontWeight: '600', fontSize: 16 }}>Read all</Text>
            </TouchableOpacity>
        ),
        headerLeft: () => (
            // <Image style={{ width: 50, height: 35 }} source={logoURL} />
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
                    Notifications
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
        refetchNotifications();
    }, []);


    const [notifications, setNotifications] = useState([]),
        [nonReadNotifications, setNonReadNotifications] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetchNotifications();
    }, []);

    const { loading, error, data, refetch: refetchNotifications } = useQuery(GET_NOTIFICATIONS, {
        variables: {
            unionID: userData?.unionID,
            userID: userData?.id,
        },
        onCompleted: () => {
            setNotifications(data.notifications);
            console.log(data.notifications);
            let arr = [];
            for (let i = 0; i < data?.notifications?.length; i++) {
                if (data.notifications[i].read == false) {
                    arr.push(data.notifications[i].id);
                }
            }
            setNonReadNotifications(arr);
            setRefreshing(false);
            // console.log(data.notifications);
        },
        onError: (err) => {
            console.log(err);
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    const [readNotificationAll] = useMutation(READ_NOTIFICATION_ALL, {
        variables: {
            notificationID: nonReadNotifications
        },
        onCompleted: () => {
            console.log("read all");
            navigation.navigate("Main");
        },
        onError: (err) => {
            console.log(err);
        },
    });



    const sendDeletedItem = (notification) => {
        // console.log(userData);
        // setNotifications([]);
        setTimeout(() => {
            refetchNotifications();
        }, 300);
    }

    if (loading) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "#EAF1F5" }}>
                <ActivityIndicator size="large" color="blue" />
                {/* <Text style={{ marginTop: 10 }}>We trying to get notifications.</Text> */}
                {/* <Text>May be you don't have new notifications</Text> */}
            </View>
        )
    }

    if (!notifications) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>You don't have any notifications.</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#EAF1F5",
        }}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* <FlatList
                    style={styles.wrapper}
                    data={notifications}
                    renderItem={({ item }) => (
                        <Notification
                            notification={item}
                            sendDeletedItem={sendDeletedItem}
                        />
                    )}
                    keyExtractor={(item) => item?.id}
                /> */}

                <View style={styles.wrapper}>
                    {notifications.map(item => (
                        <Notification
                            key={item.id}  // Ensure each item has a unique key
                            notification={item}
                            sendDeletedItem={sendDeletedItem}
                        />
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        overflow: 'scroll'
    },
});
