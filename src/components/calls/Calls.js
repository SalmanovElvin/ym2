import React, { useEffect, useState, useRef } from "react";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    ScrollView,
    Button,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    Linking,
} from "react-native";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import Svg, {
    G,
    Circle,
    Path,
    Defs,
    ClipPath,
    Rect,
    Ellipse,
    Line,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderInPages } from './../header/HeaderInPages';
import { GET_CLICK_TO_CALLS } from "../../../graph/queries/clickToCall";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Calls = ({ navigation, route }) => {

    const [userData, setUserData] = useState(null);
    const [unionData, setUnionData] = useState("");

    useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

                if (value !== null) {
                    setUnionData(JSON.parse(value));
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

    const [callsArr, setCallsArr] = useState([]);

    const { data, error, loading, refetch } = useQuery(GET_CLICK_TO_CALLS, {
        variables: {
            unionID: userData?.unionID,
        },
        onCompleted: () => {
            setCallsArr(data.getClickToCalls);
        },
        onError: (err) => {
            console.log(err);
            refetch();
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });


    return (
        <>
            <HeaderInPages title="Click to call" />
            {callsArr.length === 0 ?
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
                :
                <ScrollView style={styles.wrapper}>
                    {callsArr?.data?.map((item) =>
                        <View key={item.id} style={styles.block}>
                            <Text style={{ textTransform: 'uppercase', fontWeight: '600', fontSize: 16, color: '#242529' }}>
                                {item.title}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10, }}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontWeight: '300', fontSize: 14 }}>
                                        Starts on:
                                    </Text>
                                    <Text style={{ color: '#696666', fontWeight: '400', fontSize: 14 }}>
                                        {new Date(item?.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>

                                <View style={{ marginLeft: 10, width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontWeight: '300', fontSize: 14 }}>
                                        Ends on:
                                    </Text>
                                    <Text style={{ color: '#696666', fontWeight: '400', fontSize: 14 }}>
                                        {new Date(item?.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)} style={{ paddingVertical: 16, paddingHorizontal: 32, backgroundColor: '#34519A', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }} activeOpacity={0.6}>
                                <Text style={{ fontWeight: '700', fontSize: 16, color: '#FFFFFF' }}>Call:  {item.phone}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                </ScrollView>
            }

        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 28,
        paddingHorizontal: 14,
        flex: 1
    },
    block: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        shadowColor: "#4468C1",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 7,
        elevation: 5,
    },

});
