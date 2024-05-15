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
import { HeaderInPages } from "../header/HeaderInPages";
import { GET_SINGLE_GRIEVANCE } from "../../../graph/queries/grievances";


const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Grievance = ({ navigation, route }) => {

    const { grievanceData } = route.params;
    // console.log(grievanceData);


    const [userData, setUserData] = useState(null);
    const [unionData, setUnionData] = useState("");



    useEffect(() => {
        const getData = async () => {
            try {
                const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

                if (value !== null) {
                    setUnionData(JSON.parse(value));
                    console.log(JSON.parse(value));
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



    const [singleGrievanceData, setSingleGrievanceData] = useState([]);
    const { data, loading, error, refetch } = useQuery(GET_SINGLE_GRIEVANCE, {
        variables: {
            unionID: userData?.unionID,
            grievanceID: grievanceData?.id
        },
        onCompleted: (data) => {
            setSingleGrievanceData(data?.singleGrievance);
            // console.log(data?.singleGrievance);

        },
        onError: (err) => {
            console.log("Error with getting signle grievance");
            refetch();
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });


    // if (openGrievances.length === 0) {
    //     return (
    //         <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
    //             <ActivityIndicator size="large" color="blue" />
    //         </View>
    //     );
    // }

    return (
        <>
            <HeaderInPages title="Grievance topic" />
            {singleGrievanceData.length === 0 ?
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
                :
                <View style={styles.wrapper}>
                    <View style={styles.block}>
                        <View style={styles.rows}>
                            <View style={{ width: '45%' }}>
                                <Text style={{ color: '#696666', fontSize: 12, fontWeight: '600', marginBottom: 2 }}>
                                    {grievanceData?.caseNumber}
                                </Text>
                                <Text style={{ color: '#242529', fontSize: 16, fontWeight: '600' }}>
                                    {grievanceData?.title}
                                </Text>
                            </View>
                            <View style={{ backgroundColor: '#EEF164', alignItems: 'center', justifyContent: 'center', borderRadius: 16, width: 100 }}>
                                <Text style={{ color: '#8B8E05', fontSize: 16, fontWeight: '600', padding: 10, }}>
                                    {grievanceData?.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rows}>
                            <View style={{ width: '45%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Submitted on
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    {new Date(grievanceData?.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </Text>
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Last updated on:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    {new Date(grievanceData?.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                </Text>
                            </View>
                        </View>
                        {singleGrievanceData?.steward?.length !== 0 ?
                            <View style={styles.rows}>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        Steward:
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                        Fred Vecchio
                                        {/* {singleGrievanceData.steward} */}
                                    </Text>
                                </View>
                                <View style={{ width: '45%' }}>
                                    <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                        SubSteward:
                                    </Text>
                                    <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                        Lina Vecchio
                                        {/* {singleGrievanceData.subSteward} */}
                                    </Text>
                                </View>
                            </View>
                            : <></>}

                        <View style={styles.rows}>
                            <View style={{ width: '45%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Members:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    Frankie Ward
                                    {/* {singleGrievanceData.steward} */}
                                </Text>
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Union:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    {unionData?.name}
                                </Text>
                            </View>
                        </View>


                        <View style={styles.rows}>
                            <View style={{ width: '70%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Result:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    Frankie was let go for barking on the job
                                    {/* {singleGrievanceData.steward} */}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rows}>
                            <View style={{ width: '70%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Request:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    The employer re-instates the employee immediately
                                    {/* {singleGrievanceData.steward} */}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.rows}>
                            <View style={{ width: '70%' }}>
                                <Text style={{ color: '#A6A9B4', fontSize: 14, fontWeight: '400', marginBottom: 2 }}>
                                    Favour of Employee:
                                </Text>
                                <Text style={{ color: '#696666', fontSize: 14, fontWeight: '600' }}>
                                    NO
                                    {/* {singleGrievanceData.steward} */}
                                </Text>
                            </View>
                        </View>

                        <View style={{ marginVertical: 8, flexDirection: 'column', marginBottom: 8 }}>
                            <View style={{ width: '70%' }}>
                                <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
                                    Documents
                                    {/* {singleGrievanceData.steward} */}
                                </Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.6} style={{ marginTop: 8, borderRadius: 15, borderWidth: 1, borderColor: '#A6A9B4', borderStyle: 'solid', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Svg width="26" height="32" viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path d="M18.1344 0H1.55036C1.08864 0 0.714355 0.374286 0.714355 1.10057V31.0859C0.714355 31.2831 1.08864 32 1.55036 32H24.4498C24.9115 32 25.2858 31.2479 25.2858 31.0508V7.416C25.2858 7.01829 25.2326 6.89029 25.1389 6.796L18.4898 0.146857C18.3955 0.0531429 18.2675 0 18.1344 0Z" fill="#E9E9E0" />
                                    <Path d="M24.4498 31.9997H1.55036C1.08864 31.9997 0.714355 31.6254 0.714355 31.1637V22.2854H25.2858V31.1637C25.2858 31.6254 24.9115 31.9997 24.4498 31.9997Z" fill="#FF6D1B" />
                                    <Path d="M18.4282 0.0866699V6.85753H25.1991L18.4282 0.0866699Z" fill="#D9D7CA" />
                                    <Path d="M11.6526 30.2853H10.7148V24.5276H12.3708C12.6154 24.5276 12.8577 24.5664 13.0971 24.6447C13.3366 24.723 13.5514 24.8402 13.7417 24.9962C13.932 25.1522 14.0857 25.3413 14.2028 25.5624C14.32 25.7836 14.3788 26.0322 14.3788 26.3087C14.3788 26.6007 14.3291 26.8647 14.2303 27.1019C14.1314 27.339 13.9931 27.5384 13.816 27.6996C13.6388 27.8607 13.4251 27.9859 13.1754 28.0744C12.9257 28.163 12.6491 28.207 12.3474 28.207H11.652V30.2853H11.6526ZM11.6526 25.2384V27.5196H12.512C12.6263 27.5196 12.7394 27.5002 12.852 27.4607C12.964 27.4219 13.0668 27.3579 13.1606 27.2693C13.2543 27.1807 13.3297 27.0573 13.3868 26.8984C13.444 26.7396 13.4726 26.543 13.4726 26.3087C13.4726 26.215 13.4594 26.1064 13.4337 25.9847C13.4074 25.8624 13.3543 25.7453 13.2737 25.6333C13.1926 25.5213 13.0794 25.4276 12.9337 25.3522C12.788 25.2767 12.5948 25.239 12.3554 25.239H11.6526V25.2384Z" fill="white" />
                                    <Path d="M19.5822 27.3169V29.5432C19.4622 29.6947 19.3285 29.8175 19.1799 29.9141C19.0314 30.0107 18.8754 30.0901 18.7114 30.1524C18.5474 30.2147 18.3776 30.2592 18.2034 30.2855C18.0285 30.3118 17.8559 30.3244 17.6839 30.3244C17.3399 30.3244 17.0239 30.2621 16.7348 30.1369C16.4456 30.0118 16.1931 29.8272 15.9771 29.5821C15.7611 29.3369 15.5914 29.0301 15.4691 28.6604C15.3468 28.2907 15.2856 27.8632 15.2856 27.3792C15.2856 26.8952 15.3468 26.4689 15.4691 26.1021C15.5914 25.7347 15.7605 25.4289 15.9771 25.1844C16.1931 24.9392 16.4468 24.7535 16.7388 24.6255C17.0302 24.4975 17.3456 24.4341 17.6839 24.4341C17.9965 24.4341 18.2879 24.4861 18.5588 24.5901C18.8296 24.6947 19.0714 24.8507 19.2851 25.0587L18.6365 25.6369C18.5114 25.4855 18.3679 25.3764 18.2068 25.3089C18.0451 25.2415 17.8788 25.2072 17.7068 25.2072C17.5142 25.2072 17.3302 25.2432 17.1559 25.3164C16.9811 25.3895 16.8251 25.5129 16.6874 25.6872C16.5491 25.8621 16.4411 26.0867 16.3634 26.3632C16.2856 26.6398 16.2434 26.9775 16.2382 27.3787C16.2434 27.7695 16.2839 28.1078 16.3594 28.3941C16.4348 28.6804 16.5388 28.9147 16.6719 29.0969C16.8051 29.2792 16.9559 29.4147 17.1251 29.5032C17.2942 29.5918 17.4725 29.6358 17.6605 29.6358C17.7176 29.6358 17.7942 29.6318 17.8908 29.6238C17.9868 29.6158 18.0834 29.6032 18.1799 29.5849C18.2759 29.5667 18.3685 29.5421 18.4571 29.5107C18.5456 29.4792 18.6108 29.4352 18.6525 29.3781V27.9564H17.6759V27.3158H19.5822V27.3169Z" fill="white" />
                                    <Path d="M8.93947 24.5593H7.98443V28.3107C7.98443 28.9907 7.83926 29.3651 7.22039 29.3651C6.63973 29.3651 6.47164 29.006 6.47164 28.3871V28.1044H5.5166V28.3948C5.5166 29.3957 5.9903 30.1444 7.14399 30.1444C8.71026 30.1444 8.93947 29.2046 8.93947 28.2572V24.5593Z" fill="white" />
                                    <Path d="M7.81789 10.8565C9.25982 10.8565 10.4287 9.68756 10.4287 8.24562C10.4287 6.80369 9.25982 5.63477 7.81789 5.63477C6.37595 5.63477 5.20703 6.80369 5.20703 8.24562C5.20703 9.68756 6.37595 10.8565 7.81789 10.8565Z" fill="#F3D55B" />
                                    <Path d="M0.714355 22.2863H7.00007H25.2858V16.0006L19.5715 10.572L13.5715 17.1435L10.4384 14.0103L0.714355 22.2863Z" fill="#FF995F" />
                                </Svg>
                                <Text style={{ color: '#2D2D2D', fontSize: 16, fontWeight: '400', marginLeft: 10 }}>
                                    Screenshot_2365.png
                                </Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                </View >
            }

        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 30,
        paddingHorizontal: 20,
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
