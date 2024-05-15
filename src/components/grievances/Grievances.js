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
import { useMutation, useQuery } from "@apollo/client";
import Svg, {
    G,
    Circle,
    Path,
    Defs,
    ClipPath,
    Rect,
    Ellipse,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_GRIEVANCES } from './../../../graph/queries/grievances';


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Grievances = ({ navigation, route }) => {
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
            alignItems: "center",
            justifyContent: "center",
        },
        headerRight: () => <></>,
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
                    Grievances
                </Text>
            </TouchableOpacity>
        ),
    });


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

    const [isOpenCategory, setIsOpenCategory] = useState(true);

    const [grievances, setGrievances] = useState([]);
    const [closedGrievances, setClosedGrievances] = useState([]);
    const [openGrievances, setOpenGrievances] = useState([]);

    //query
    const { data, loading, error, refetch } = useQuery(GET_GRIEVANCES, {
        variables: {
            unionID: userData?.unionID,
        },
        onCompleted: (data) => {
            setGrievances(data?.grievances);
            setClosedGrievances(data?.grievances.filter(grievance => grievance.status === "closed"));
            setOpenGrievances(data?.grievances.filter(grievance => grievance.status != "closed"));
            console.log(data?.grievances.filter(grievance => grievance.status != "closed"));
        },
        onError: (err) => {
            console.log(err);
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });


    if (openGrievances.length === 0) {
        return (
            <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={{ paddingHorizontal: 14 }}>
                <View style={styles.chooseBar}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setIsOpenCategory(true)} style={isOpenCategory ? { ...styles.choosElement, backgroundColor: '#fff' } : { ...styles.choosElement, }}>
                        <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                            Open grievances
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setIsOpenCategory(false)} style={!isOpenCategory ? { ...styles.choosElement, backgroundColor: '#fff' } : { ...styles.choosElement, }}>
                        <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>Closed grievances</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={{ padding: 10 }}>
                {isOpenCategory ?
                    openGrievances.map((item) => (
                        <TouchableOpacity onPress={() => navigation.navigate('Grievance', { data: item })} TouchableOpacity activeOpacity={0.6} style={styles.block}>
                            <View style={styles.rows}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#696666', fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                        {item.caseNumber}
                                    </Text>
                                    <Text style={{ color: '#242529', fontSize: 16, fontWeight: '600' }}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View style={{ width: '45%', backgroundColor: '#EEF164', alignItems: 'center', justifyContent: 'center', borderRadius: 16, width: 90 }}>
                                    <Text style={{ color: '#8B8E05', fontSize: 16, fontWeight: '600', padding: 10, }}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.rows}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        Submitted on
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '400' }}>
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        Last updated on:
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '400' }}>
                                        {new Date(item.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))


                    :
                    closedGrievances.map((item) => (
                        <View style={styles.block}>
                            <View style={styles.rows}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#696666', fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                        {item.caseNumber}
                                    </Text>
                                    <Text style={{ color: '#242529', fontSize: 16, fontWeight: '600' }}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View style={{ width: '45%', backgroundColor: '#5BD476', alignItems: 'center', justifyContent: 'center', borderRadius: 16, width: 90 }}>
                                    <Text style={{ color: '#F9FAFC', fontSize: 16, fontWeight: '600', padding: 10, }}>
                                        {item.status}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.rows}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        Submitted on
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '400' }}>
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        Last updated on:
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '400' }}>
                                        {new Date(item.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
        </View >
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 24,
        flex: 1
    },
    chooseBar: {
        backgroundColor: '#E4E5EB',
        borderRadius: 15,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 14,
    },
    choosElement: {
        width: '49%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10
    },
    block: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 24,
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
