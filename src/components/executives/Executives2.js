import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Button,
    FlatList,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    Platform,
    TextInput,
    KeyboardAvoidingView,
    Linking
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
import { GET_EXECUTIVES } from "../../../graph/queries/users";
import { HeaderInPages } from "../header/HeaderInPages";

export const Executives2 = ({ navigation, route }) => {

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
                    refetch();
                } else {
                    console.log("No user data found");
                }
            } catch (error) {
                console.error("Error retrieving data:", error);
            }
        };
        getData();

    }, []);


    const [executives, setExecutives] = useState([]);

    const { data, loading, refetch } = useQuery(GET_EXECUTIVES, {
        variables: {
            unionID: userData?.unionID,
            category: "executive_second"
        },
        onCompleted: () => {
            if (data.executives) {
                setExecutives(data.executives);
            } else {
                setExecutives([]);
            }
            // console.log(data.executives);
        },
        onError: (err) => {
            console.log(err);
        },
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
    });

    // if (userData?.unionID) {

    // }




    return (
        <>
            <SafeAreaView style={{
                flex: 1,
                width: "100%",
                backgroundColor: "#EAF1F5",
            }}>
                <HeaderInPages title="Executives" />
                {loading ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator size="large" color="blue" />
                    </View>
                    :
                    executives?.length === 0 ?
                        <Text style={{ padding: 15, textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#696666' }}>There are no any executives.</Text>
                        :
                        <ScrollView style={styles.wrapper}>
                            {executives.map((item) => (
                                <View key={item?.id} style={styles.block}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {item?.memberData?.profile?.imageURL !== "" ?
                                            <View>
                                                <Image
                                                    source={{ uri: item?.memberData?.profile?.imageURL }}
                                                    style={{ width: 80, height: 80, zIndex: 1, borderRadius: 100 }}
                                                />
                                            </View> :
                                            <View style={{ height: 80, width: 80, backgroundColor: '#EDEEF1', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                                <Svg
                                                    style={{ width: 40, height: 40, borderRadius: 50 }}
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
                                            </View>
                                        }
                                        <View style={{ marginLeft: 17 }}>
                                            <Text style={{ marginBottom: 8, fontWeight: '600', fontSize: 18, color: "#000" }}>
                                                {item?.memberData?.firstName} {item?.memberData?.lastName}
                                            </Text>
                                            <Text style={{ fontWeight: '300', fontSize: 16, color: "#000" }}>
                                                {item?.position}
                                            </Text>
                                        </View>
                                    </View>



                                    {item?.memberData?.profile?.email && item?.display.email == true ?
                                        <>
                                            <View style={{ height: 2, backgroundColor: '#F4F4F4', marginVertical: 15 }}></View>
                                            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item?.memberData?.profile?.email}`)}>
                                                <Text style={{ color: '#0A93E1', fontWeight: '400', fontSize: 16 }}>{item?.memberData?.profile?.email}</Text>
                                            </TouchableOpacity>
                                        </>
                                        :
                                        <></>
                                    }

                                    {item?.memberData?.profile?.unionMail && item?.memberData?.profile?.email.trim() !== item?.memberData?.profile?.unionMail.trim() ?
                                        <>
                                            {item?.display.email == true ? <>
                                                <View style={{ height: 2, backgroundColor: '#F4F4F4', marginVertical: 15 }}></View>
                                                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${item?.memberData?.profile?.unionMail}`)}>
                                                    <Text style={{ color: '#0A93E1', fontWeight: '400', fontSize: 16 }}>{item?.memberData?.profile?.unionMail}</Text>
                                                </TouchableOpacity>
                                            </> : <></>}
                                        </>
                                        :
                                        <></>
                                    }

                                    {item?.extension && item?.display.extension == true ?
                                        <>
                                            <View style={{ height: 2, backgroundColor: '#F4F4F4', marginVertical: 15 }}></View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ color: '#242529', fontWeight: '700', fontSize: 16 }}>
                                                    Office:
                                                </Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {!item?.memberData?.profile?.phone ?
                                                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${unionData?.information?.phone}`)}>
                                                            <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                                                                {unionData?.information?.phone}
                                                            </Text>
                                                        </TouchableOpacity>
                                                        :
                                                        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.memberData?.profile?.phone}`)}>
                                                            <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                                                                {item?.memberData?.profile?.phone}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    }


                                                    {item?.display.extension == true && item?.extension ?
                                                        <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                                                            {item?.extension ? ` EXT.${item?.extension}` : ''}
                                                        </Text>
                                                        : <></>}

                                                </View>
                                            </View>

                                        </>
                                        :
                                        <></>
                                    }

                                    {item?.memberData?.profile?.mobile && item?.display.mobile == true ?
                                        <>
                                            <View style={{ height: 2, backgroundColor: '#F4F4F4', marginVertical: 15 }}></View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={{ color: '#242529', fontWeight: '700', fontSize: 16 }}>
                                                    Mobile:
                                                </Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.memberData?.profile?.mobile}`)}>
                                                        <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                                                            {item?.memberData?.profile?.mobile}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </>
                                        :
                                        <></>
                                    }


                                </View>
                            ))}
                        </ScrollView>
                }
            </SafeAreaView>
        </>
    );
}
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        paddingHorizontal: 24
    },
    block: {
        marginBottom: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 24,
        shadowColor: "#4468c1",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 11.27,
        elevation: 5,
    }
});
