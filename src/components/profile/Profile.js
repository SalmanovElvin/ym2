import React, { useEffect, useState, useRef } from "react";
import {
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
    TextInput
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
import { MODIFY_USER } from "../../../graph/mutations/users";
import AnimatedLoader from 'react-native-animated-loader';
import * as ImagePicker from "expo-image-picker";

export const Profile = ({ navigation, route }) => {

    const { signOutUserAnsStr } = route.params;

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
            <TouchableOpacity onPress={edirData} activeOpacity={0.6} style={{ flexDirection: "row", marginRight: 10 }}>
                <Text style={{ color: '#0F3BAA', fontWeight: '600', fontSize: 16 }}>Save</Text>
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
                    Profile
                </Text>
            </TouchableOpacity>
        ),
    });


    const [image, setImage] = useState(null);
    const [text, setText] = useState("");

    const openImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();
        setProfileImg(result.assets[0].uri);
        setIsPhoto(false);
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            alert("Sorry, we need camera permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        setProfileImg(result.assets[0].uri);
        setIsPhoto(false);
    };

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
                    setName(JSON.parse(userVal)?.firstName);
                    setLastName(JSON.parse(userVal)?.lastName);
                    setUsername(JSON.parse(userVal)?.username);
                    setEmail(JSON.parse(userVal)?.profile?.email);
                    setOldEmail(JSON.parse(userVal)?.profile?.email);
                    setPhone(JSON.parse(userVal)?.profile?.phone);
                    setCity(JSON.parse(userVal)?.profile?.city);
                    setProvince(JSON.parse(userVal)?.profile?.province);
                    setPostalCode(JSON.parse(userVal)?.profile?.postalCode);
                    setAddress(JSON.parse(userVal)?.profile?.address);
                    setProfileImg(JSON.parse(userVal)?.profile?.imageURL)

                } else {
                    console.log("No user data found");
                }
            } catch (error) {
                console.error("Error retrieving data:", error);
            }
        };
        getData();

    }, []);




    const [name, setName] = useState(),
        [lastName, setLastName] = useState(''),
        [username, setUsername] = useState(''),
        [email, setEmail] = useState(''),
        [oldEmail, setOldEmail] = useState(''),
        [profileImg, setProfileImg] = useState(''),
        [phone, setPhone] = useState(''),
        [city, setCity] = useState(''),
        [postalCode, setPostalCode] = useState(''),
        [province, setProvince] = useState(''),
        [address, setAddress] = useState(''),
        [dateOfBirth, setDateOfBirth] = useState('');



    const [modifyUserMutation, { loading }] = useMutation(MODIFY_USER, {
        onCompleted: () => {
            setChanging(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 1500);
            console.log('changed');
        },
        onError: (error) => {
            setChanging(false);
            alert(error.message);
        }
    });

    const modifyUser = (input) => {
        modifyUserMutation({ variables: { unionID: userData?.unionID, userID: userData?.id, input } });
    };

    const edirData = () => {
        setChanging(true);
        let newObj = oldEmail !== email ? {
            // dateOfBirth: "1975-04-08T20:00:00Z",
            firstName: name,
            lastName: lastName,
            username: username,
            profile: {
                address: address,
                city: city,
                email: email,
                imageURL: profileImg,
                phone: phone,
                postalCode: postalCode,
                province: province
            }
        }
            :
            {
                // dateOfBirth: "1975-04-08T20:00:00Z",
                firstName: name,
                lastName: lastName,
                username: username,
                profile: {
                    address: address,
                    city: city,
                    imageURL: profileImg,
                    phone: phone,
                    postalCode: postalCode,
                    province: province
                }
            };
        AsyncStorage.setItem("@USER", JSON.stringify({ ...userData, ...newObj }));
        setUserData({ ...userData, ...newObj });
        modifyUser(newObj);

    }

    const [changing, setChanging] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isPhoto, setIsPhoto] = useState(false);

    if (!userData) {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        )
    }

    return (
        <>
            {isPhoto ?
                <View style={{ zIndex: 999, height: '100%', width: "100%", backgroundColor: 'rgba(0, 0, 50, 0.5)', justifyContent: 'center', alignItems: 'center', position: 'absolute' }}>
                    <View style={styles.modal}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={openCamera} activeOpacity={0.7} style={styles.conf1}>
                                <Text style={{ ...styles.btnConf, color: '#fff' }}>Take a photo.</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={openImagePicker} activeOpacity={0.7} style={styles.conf1}>
                                <Text style={{ ...styles.btnConf, color: '#fff' }}>Select a photo from the library.</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => { setIsPhoto(false) }} activeOpacity={0.7} style={styles.conf}>
                            <Text style={styles.btnConf}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                :
                <></>
            }

            <AnimatedLoader
                visible={changing}
                overlayColor="rgba(255,255,255,0.9)"
                animationStyle={styles.lottie}
                speed={1}
                source={require("../../../animations/Animation.json")}>
            </AnimatedLoader>
            <AnimatedLoader
                visible={success}
                overlayColor="rgba(255,255,255,0.9)"
                animationStyle={styles.lottie}
                speed={1.2}
                source={require("../../../animations/success.json")}>
            </AnimatedLoader>
            <ScrollView style={styles.main}>
                <View style={styles.wrapper}>
                    <View style={{ marginBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.photo}>
                            {profileImg == '' ?
                                <View style={{ height: 120, width: 120, backgroundColor: '#EDEEF1', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                                    <Svg
                                        style={{ width: 70, height: 70, borderRadius: 50 }}
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
                                :
                                <Image
                                    source={{ uri: profileImg }}
                                    style={{ width: 120, height: 120, zIndex: 1, borderRadius: 100 }}
                                />
                            }

                            <TouchableOpacity onPress={() => { setIsPhoto(true) }} activeOpacity={0.6} style={styles.photoIcon}>
                                <Svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Rect x="0.429443" y="2.28943" width="21.1411" height="13.3523" rx="2" fill="white" />
                                    <Path d="M6.59779 0.838331C6.77917 0.539873 7.10311 0.357666 7.45236 0.357666H14.5477C14.8969 0.357666 15.2209 0.539873 15.4022 0.838331L16.2844 2.29002H5.71558L6.59779 0.838331Z" fill="white" />
                                    <Circle cx="11" cy="8.96574" r="3.57743" stroke="black" strokeWidth="1.2" />
                                    <Circle cx="4.87067" cy="5.35017" r="0.844795" fill="black" />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoAndLogOutWrapper}>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: '600', lineHeight: 21.78 }}>{userData.firstName}</Text>
                                <Text style={{ fontSize: 18, fontWeight: '600', lineHeight: 21.78 }}>{userData.lastName}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                signOutUserAnsStr();
                            }} activeOpacity={0.6} style={styles.logOut}>
                                <Svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <Path fillRule="evenodd" clipRule="evenodd" d="M5.7723 9.99997C5.7723 9.82023 5.8437 9.64786 5.9708 9.52076C6.09789 9.39366 6.27027 9.32226 6.45001 9.32226H16.3654L14.5934 7.80419C14.5258 7.74628 14.4702 7.67561 14.4299 7.59623C14.3895 7.51684 14.3652 7.43029 14.3584 7.34152C14.3515 7.25274 14.3621 7.16348 14.3898 7.07883C14.4174 6.99418 14.4614 6.9158 14.5193 6.84816C14.5772 6.78052 14.6479 6.72495 14.7273 6.68462C14.8066 6.64429 14.8932 6.61999 14.982 6.61311C15.0708 6.60623 15.16 6.6169 15.2447 6.64452C15.3293 6.67214 15.4077 6.71615 15.4753 6.77406L18.638 9.48491C18.7124 9.54854 18.7721 9.62752 18.8131 9.71644C18.854 9.80535 18.8752 9.90208 18.8752 9.99997C18.8752 10.0979 18.854 10.1946 18.8131 10.2835C18.7721 10.3724 18.7124 10.4514 18.638 10.515L15.4753 13.2259C15.3387 13.3428 15.1613 13.4007 14.982 13.3868C14.8027 13.3729 14.6363 13.2884 14.5193 13.1518C14.4024 13.0152 14.3445 12.8377 14.3584 12.6584C14.3723 12.4791 14.4568 12.3127 14.5934 12.1958L16.3645 10.6777H6.45001C6.27027 10.6777 6.09789 10.6063 5.9708 10.4792C5.8437 10.3521 5.7723 10.1797 5.7723 9.99997Z" fill="#5783EF" />
                                    <Path d="M11.8718 6.38557C11.8718 7.01991 11.8718 7.33708 11.7191 7.56569C11.6533 7.66399 11.5689 7.74841 11.4706 7.81419C11.242 7.9669 10.9248 7.9669 10.2905 7.9669H6.45013C5.9109 7.9669 5.39377 8.1811 5.01248 8.56239C4.63119 8.94368 4.41699 9.46081 4.41699 10C4.41699 10.5393 4.63119 11.0564 5.01248 11.4377C5.39377 11.819 5.9109 12.0332 6.45013 12.0332H10.2905C10.9248 12.0332 11.242 12.0332 11.4706 12.185C11.569 12.251 11.6534 12.3358 11.7191 12.4344C11.8718 12.663 11.8718 12.9802 11.8718 13.6145C11.8718 16.1699 11.8718 17.4485 11.0775 18.2419C10.2842 19.0362 9.00646 19.0362 6.45103 19.0362H5.54741C2.99018 19.0362 1.71337 19.0362 0.919088 18.2419C0.124809 17.4485 0.124809 16.1699 0.124809 13.6145V6.38557C0.124809 3.83014 0.124809 2.55152 0.919088 1.75815C1.71337 0.963867 2.99108 0.963867 5.54651 0.963867H6.45013C9.00646 0.963867 10.2842 0.963867 11.0775 1.75815C11.8718 2.55152 11.8718 3.83014 11.8718 6.38557Z" fill="#5783EF" />
                                </Svg>
                                <Text style={{ color: '#242529' }}>Log out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TextInput
                        onChangeText={setName}
                        value={name}
                        style={styles.input}
                        placeholder="First name"
                    />
                    <TextInput
                        onChangeText={setLastName}
                        value={lastName}
                        style={styles.input}
                        placeholder="Last name"
                    />
                    <TextInput
                        onChangeText={setUsername}
                        value={username}
                        style={styles.input}
                        placeholder="Username"
                    />
                    <TextInput
                        onChangeText={setEmail}
                        value={email}
                        style={styles.input}
                        keyboardType="email-address"
                        placeholder="Email"
                    />
                    <TextInput
                        onChangeText={setPhone}
                        value={phone}
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholder="Cell phone"
                    />
                    <TextInput
                        onChangeText={setCity}
                        value={city}
                        style={styles.input}
                        placeholder="City"
                    />
                    <TextInput
                        onChangeText={setProvince}
                        value={province}
                        style={styles.input}
                        placeholder="Province"
                    />
                    <TextInput
                        onChangeText={setAddress}
                        value={address}
                        style={styles.input}
                        placeholder="Address"
                    />
                    <TextInput
                        onChangeText={setPostalCode}
                        value={postalCode}
                        style={styles.input}
                        placeholder="Postal code"
                    />
                    <Text style={{ fontSize: 10, textAlign: 'center', color: 'grey' }}>You can change the fields below in the web version of the portal.</Text>
                    <View style={{ height: 1, backgroundColor: 'grey', marginBottom: 10 }}>

                    </View>
                    <TextInput
                        editable={false}
                        value={userData?.status}
                        style={styles.input}
                        placeholder="Status"
                    />
                    <TextInput
                        editable={false}
                        value={userData?.unit}
                        style={styles.input}
                        placeholder="Unit"
                    />
                </View>
            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
    modal: {
        width: '80%',
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
    conf: {
        width: "100%",
        backgroundColor: "#fff",
        borderColor: '#34519A',
        borderStyle: 'solid',
        borderWidth: 1,
        height: 56,
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 5,
    },
    conf1: {
        width: "45%",
        backgroundColor: "#34519A",
        height: 65,
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 5,
    },
    btnConf: {
        color: '#34519A',
        fontWeight: '700',
        fontSize: 16
    },
    lottie: {
        width: 80,
        height: 80,
    },
    ok: {
        padding: 15,
        fontSize: 16,
        color: 'green',
        width: '70%',
        textAlign: 'center',
    },
    ok2: {
        padding: 5,
        fontSize: 16,
        color: 'green',
        width: '70%',
        textAlign: 'center',
    },
    main: {
        paddingHorizontal: 18
    },
    wrapper: {
        marginVertical: 26,
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#4468c1",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 11.27,
        elevation: 5,
    },
    photo: {
        position: 'relative',
    },
    photoIcon: {
        height: 40,
        width: 40,
        backgroundColor: '#282827',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#F9FAFC',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 2
    },
    infoAndLogOutWrapper: {
        width: '50%'
    },
    logOut: {
        marginTop: 20,
        flexDirection: 'row',
        width: '70%',
        backgroundColor: "#5783EF26",
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        marginBottom: 15,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: "#BFC2CD",
        borderRadius: 5
    }
});
