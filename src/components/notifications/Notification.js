import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, } from "react-native";

import Svg, { Path, } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/client";
import { DELETE_NOTIFICATION, MARK_NOTIFICATION } from "../../../graph/mutations/notifications";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDecay,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';

export const Notification = ({ notification, sendDeletedItem }) => {
    const navigation = useNavigation();

    const offset = useSharedValue(0);
    const width = useSharedValue(0);

    const onLayout = (event) => {
        width.value = event.nativeEvent.layout.width;
    };

    const [isOnRemoveDistance, setIsOnRemoveDistance] = useState(false);

    // if (isOnRemoveDistance) {
    // console.log('shit');
    // }

    const pan = Gesture.Pan()
        .onChange((event) => {
            offset.value += event.changeX;
            // console.log(event.absoluteX);
            // if (event.absoluteX < 150) {
            //     // setIsOnRemoveDistance(true);
            //     // console.log('shit')
            //     offset.value = withDecay({
            //         // velocity: event.velocityX,

            //         rubberBandEffect: true,
            //         clamp: [-(width.value) + screenWidth - 900, 0],
            //     });
            // }
        })
        .onFinalize((event) => {
            if (event.absoluteX >= 150) {
                offset.value = withDecay({
                    // velocity: event.velocityX,

                    rubberBandEffect: true,
                    clamp: [-(width.value) + screenWidth - 37, 0],
                });
            }
            // else {
            //     setIsOnRemoveDistance(true);
            // }
        });

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: offset.value }],
    }));





    const originalDate = new Date(notification?.createdOn);
    const formattedDate = `${originalDate.getFullYear()}-${(originalDate.getMonth() + 1).toString().padStart(2, '0')}-${originalDate.getDate().toString().padStart(2, '0')} ${originalDate.getHours().toString().padStart(2, '0')}:${originalDate.getMinutes().toString().padStart(2, '0')}:${originalDate.getSeconds().toString().padStart(2, '0')}`;

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
        if (notification.read == false) {
            setIsRead(false);
        }
    }, []);

    const [isRead, setIsRead] = useState(true);

    //Mutation to mark notification as read
    const [
        markNotificationAsRead,
        { loading: markLoading, error: markError, data: markData },
    ] = useMutation(MARK_NOTIFICATION, {
        refetchQueries: ['notifications'],
    });

    const readNotification = () => {
        markNotificationAsRead({
            variables: {
                unionID: userData?.unionID,
                notificationID: notification?.id,
                userID: userData?.id,
            },
            onCompleted: () => {
                setIsRead(true);
                // console.log('read');
            },
            onError: (err) => {
                console.log(err);
            }
        });
    }

    const clickToNotification = () => {
        if (notification?.message.toLowerCase().includes("new information has been posted in news feed")) {

            markNotificationAsRead({
                variables: {
                    unionID: userData?.unionID,
                    notificationID: notification?.id,
                    userID: userData?.id,
                },
                onCompleted: () => {
                    console.log('readed');
                },
                onError: (err) => {
                    console.log(err);
                }
            });

            navigation.navigate("Feed");

        } else {
            if (notification?.message.toLowerCase().includes("you received a new message")) {
                markNotificationAsRead({
                    variables: {
                        unionID: userData?.unionID,
                        notificationID: notification?.id,
                        userID: userData?.id,
                    },
                    onCompleted: () => {
                        console.log('readed');
                    },
                    onError: (err) => {
                        console.log(err);
                    }
                });

                navigation.navigate("Chats");
            }
            else {
                if (notification?.message.toLowerCase().includes("there is a vote available for you")) {
                    markNotificationAsRead({
                        variables: {
                            unionID: userData?.unionID,
                            notificationID: notification?.id,
                            userID: userData?.id,
                        },
                        onCompleted: () => {
                            console.log('readed');
                        },
                        onError: (err) => {
                            console.log(err);
                        }
                    });

                    navigation.navigate("Voting"); //or Services
                }
                else {
                    if (notification?.message.toLowerCase().includes("there is a campaign available")) {
                        markNotificationAsRead({
                            variables: {
                                unionID: userData?.unionID,
                                notificationID: notification?.id,
                                userID: userData?.id,
                            },
                            onCompleted: () => {
                                console.log('readed');
                            },
                            onError: (err) => {
                                console.log(err);
                            }
                        });

                        navigation.navigate("Calls"); //or Services
                    } else {
                        markNotificationAsRead({
                            variables: {
                                unionID: userData?.unionID,
                                notificationID: notification?.id,
                                userID: userData?.id,
                            },
                            onCompleted: () => {
                                console.log('readed');
                            },
                            onError: (err) => {
                                console.log(err);
                            }
                        });
                    }
                }
            }
        }
    }

    const [isDeleted, setIsDeleted] = useState('relative');


    const [delNotification, { loading }] = useMutation(DELETE_NOTIFICATION, {
        variables: {
            unionID: userData?.unionID,
            notificationID: notification?.id,
            userID: userData?.id
        },
        onCompleted: () => {
            console.log('Deleted');
            setIsDeleted('none');
        },
        onError: (err) => {
            alert("You don't have permission for proceeding this operation...");
        }
    });





    const deleteNotification = () => {
        delNotification();
        sendDeletedItem(notification);
    }

    return (
        <>

            <GestureHandlerRootView style={{ ...styles.container, display: isDeleted }}>
                <View onLayout={onLayout}>
                    {/* {isOnRemoveDistance ? <></> : */}
                        <GestureDetector gesture={pan}>
                            <Animated.View style={[styles.box, animatedStyles]} >
                                <View style={styles.wrapNot}>
                                    <TouchableOpacity
                                        onPress={clickToNotification}
                                        onLongPress={readNotification}
                                        activeOpacity={0.6} style={styles.wrapper}>
                                        {isRead == false ?
                                            <View style={styles.nonRead}></View>
                                            :
                                            <></>}
                                        <Text style={{ color: '#242529', fontWeight: '400', fontSize: 16 }}>{notification.message}</Text>
                                        <Text style={{ color: '#848587', fontSize: 14, fontWeight: '400', marginTop: 5 }}>{formattedDate}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => deleteNotification()} style={{
                                        backgroundColor: "#D94D2E",
                                        borderRadius: 10, width: 1000, height: 70,
                                        justifyContent: 'center', alignItems: 'flex-start',
                                        marginLeft: 20
                                    }}>
                                        <Svg style={{ marginLeft: 18 }} width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path fillRule="evenodd" clipRule="evenodd" d="M8.23395 0C7.19203 0 6.19278 0.418501 5.45603 1.16344C4.71928 1.90837 4.30538 2.91872 4.30538 3.97222V4.61211C3.17528 4.72231 2.04861 4.86586 0.926805 5.04256C0.785732 5.06199 0.649903 5.10965 0.527257 5.18277C0.404611 5.25588 0.297608 5.35298 0.212499 5.46839C0.127391 5.5838 0.0658845 5.7152 0.0315747 5.85491C-0.00273508 5.99463 -0.00916024 6.13986 0.0126746 6.28211C0.0345094 6.42437 0.0841661 6.5608 0.158743 6.68343C0.233321 6.80606 0.331323 6.91243 0.447022 6.99632C0.562722 7.08022 0.693798 7.13996 0.832592 7.17205C0.971386 7.20414 1.11511 7.20794 1.25538 7.18322L1.46823 7.15144L2.66966 22.3441C2.74832 23.3396 3.19495 24.2686 3.9206 24.9461C4.64626 25.6236 5.59768 25.9999 6.58538 26H13.4525C14.4402 26.0003 15.3918 25.6244 16.1177 24.9472C16.8437 24.2699 17.2906 23.341 17.3697 22.3456L18.5711 7.15L18.7839 7.18322C19.0621 7.22153 19.344 7.14794 19.569 6.97828C19.7941 6.80861 19.9443 6.55642 19.9873 6.27594C20.0304 5.99547 19.9628 5.70911 19.7992 5.47846C19.6356 5.24781 19.3891 5.09129 19.1125 5.04256C17.9907 4.86602 16.864 4.72248 15.7339 4.61211V3.97222C15.7339 2.91872 15.32 1.90837 14.5833 1.16344C13.8465 0.418501 12.8473 0 11.8054 0H8.23395ZM10.0197 4.33333C11.2197 4.33333 12.4097 4.36944 13.5911 4.44167V3.97222C13.5911 2.97556 12.7911 2.16667 11.8054 2.16667H8.23395C7.24823 2.16667 6.44823 2.97556 6.44823 3.97222V4.44167C7.62966 4.36944 8.81966 4.33333 10.0197 4.33333ZM7.99109 9.70667C7.97972 9.41935 7.85594 9.14836 7.64697 8.95333C7.438 8.75829 7.16096 8.65517 6.8768 8.66667C6.59264 8.67816 6.32464 8.80332 6.13174 9.01461C5.93885 9.2259 5.83687 9.50601 5.84823 9.79333L6.2768 20.6267C6.28243 20.7689 6.31572 20.9087 6.37476 21.0379C6.43381 21.1672 6.51745 21.2834 6.62092 21.38C6.72439 21.4766 6.84566 21.5516 6.97781 21.6008C7.10995 21.65 7.25039 21.6724 7.39109 21.6667C7.53179 21.661 7.67001 21.6273 7.79784 21.5676C7.92568 21.5079 8.04064 21.4233 8.13615 21.3187C8.23166 21.2141 8.30586 21.0915 8.3545 20.9579C8.40315 20.8243 8.42529 20.6823 8.41966 20.54L7.99109 9.70667ZM14.1911 9.79333C14.1967 9.65107 14.1746 9.50907 14.1259 9.37546C14.0773 9.24185 14.0031 9.11923 13.9076 9.01461C13.8121 8.90999 13.6971 8.82541 13.5693 8.76571C13.4414 8.70601 13.3032 8.67236 13.1625 8.66667C12.8784 8.65517 12.6013 8.75829 12.3924 8.95333C12.1834 9.14836 12.0596 9.41935 12.0482 9.70667L11.6197 20.54C11.614 20.6823 11.6362 20.8243 11.6848 20.9579C11.7335 21.0915 11.8077 21.2141 11.9032 21.3187C11.9987 21.4233 12.1136 21.5079 12.2415 21.5676C12.3693 21.6273 12.5075 21.661 12.6482 21.6667C12.7889 21.6724 12.9294 21.65 13.0615 21.6008C13.1937 21.5516 13.3149 21.4766 13.4184 21.38C13.5219 21.2834 13.6055 21.1672 13.6646 21.0379C13.7236 20.9087 13.7569 20.7689 13.7625 20.6267L14.1911 9.79333Z" fill="#fff" />
                                        </Svg>
                                    </TouchableOpacity>

                                </View>
                            </Animated.View>
                        </GestureDetector>
                        {/* } */}
                </View>
            </GestureHandlerRootView>
        </>

    );
};


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
    wrapNot: {
        flexDirection: 'row',
        width: screenWidth,
        alignItems: 'center'
    },
    circle: {
        cursor: 'grab',
    },
    wrapper: {
        position: 'relative',
        paddingVertical: 16,
        paddingHorizontal: 24,
        justifyContent: 'center',
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
        overflow: 'hidden',
        width: '90%'
        // borderLeftColor:'#4468C1',
        // borderLeftWidth:10
    },
    nonRead: {
        position: 'absolute',
        width: 10,
        height: 400,
        backgroundColor: '#4468C1'
    },
});
