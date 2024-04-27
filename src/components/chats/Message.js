import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    TextInput
} from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS, GET_MESSAGES } from './../../../graph/queries/messages';

export const Message = ({ navigation, route, msg }) => {


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


    const originalTimestamp = new Date(msg?.createdAt);

    const formattedTimestamp = `${originalTimestamp.getDate().toString().padStart(2, '0')}.${(originalTimestamp.getMonth() + 1).toString().padStart(2, '0')}.${originalTimestamp.getFullYear()} ${originalTimestamp.getHours().toString().padStart(2, '0')}:${originalTimestamp.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={msg?.sender?.id === userData?.id ? {
            flexDirection: 'row-reverse',
            alignItems: "flex-end",
            marginBottom: 10
        } : {
            flexDirection: 'row',
            alignItems: "flex-end",
            marginBottom: 10
        }}>
            {msg?.sender?.profile?.imageURL !== '' ?
                <Image style={msg?.sender?.id === userData?.id ? { width: 35, height: 35, borderRadius: 50, marginLeft: 5 } :
                    { width: 35, height: 35, borderRadius: 50, marginRight: 5 }
                } source={{ uri: msg?.sender?.profile?.imageURL }} />
                :
                <Svg
                    style={{ width: 30, height: 30, borderRadius: 50, }}
                    viewBox="0 0 1024 1024"
                    class="icon"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <Path
                        d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z"
                        fill="#4A5699"
                    />
                    <Path
                        d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z"
                        fill="#C45FA0"
                    />
                    <Path
                        d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z"
                        fill="#E5594F"
                    />
                </Svg>
            }
            <View style={{ width: '70%', paddingBottom: 10 }}>
                <View style={styles.wrapper}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#242529' }}>{msg?.sender?.firstName} {msg?.sender?.lastName}</Text>
                    <Text style={{ width: '85%', marginTop: 5, fontSize: 14, fontWeight: '400', color: '#242529' }}>{msg?.content}</Text>
                </View>
                <Text style={{ position: 'absolute', right: 10, bottom: 10, fontSize: 12, fontWeight: '500', color: '#848587', }}>{formattedTimestamp}</Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({

    wrapper: {
        position: 'relative',
        paddingVertical: 10,
        paddingHorizontal: 15,
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
        marginBottom: 15,
        // borderLeftColor:'#4468C1',
        // borderLeftWidth:10
    },
});
