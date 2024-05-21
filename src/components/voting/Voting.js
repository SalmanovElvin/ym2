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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Voting = ({ navigation, route }) => {

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




    return (
        <>
            <HeaderInPages title="Voting" />

        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        flex: 1
    },
    searchInput: {
        height: '100%',
        width: '85%',
        paddingVertical: 16,
        fontSize: 16,
        color: '#A8A8AA',
        fontWeight: '500'
    },
    searchInputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#FFFFFF',
        shadowColor: "#4468C1", // Shadow color
        shadowOffset: {
            width: 0,
            height: 2, // Shadow height
        },
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5,

        paddingHorizontal: 24,
        borderRadius: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },


    block: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
        paddingVertical: 10,
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
    rows: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8
    },


    modalBack: {
        zIndex: 999,
        width: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 50, 0.5)',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 15,
        justifyContent: 'space-between',
        shadowColor: "#4468c1",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.23,
        shadowRadius: 11.27,
    },
    errMsg: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
    },
    tip: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        fontStyle: 'italic',
        color: 'green',
        marginBottom: 15,
    },
    conf: {
        width: "100%",
        backgroundColor: "#34519A",
        height: 56,
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 5,
    },
    btnConf: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16

    },
});
