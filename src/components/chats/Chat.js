import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS, GET_MESSAGES } from './../../../graph/queries/messages';
import { useNavigation } from '@react-navigation/native';

export const Chat = ({ route, chat, participants }) => {
    const navigation = useNavigation();
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

    const [lastMsg, setLastMsg] = useState([])

    const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
        variables: {
            unionID: userData?.unionID,
            chatID: chat?.id,
        },
        onCompleted: () => {
            setLastMsg(data?.messages[data?.messages?.length - 1]);
            // console.log(data?.messages);
        },
        notifyOnNetworkStatusChange: true,
        pollInterval: 5000,
    });

    // console.log(participants);

    const participantsrArr = participants.filter((item) => { return item.firstName.toLowerCase() !== userData?.firstName.toLowerCase() || item.lastName.toLowerCase() !== userData?.lastName.toLowerCase() });
    let participantsString = "";
    for (let i = 0; i < participantsrArr.length; i++) {
        if (i == 0) {
            participantsString = participantsString + participantsrArr[participantsrArr.length - i - 1].firstName + " " + participantsrArr[participantsrArr.length - i - 1].lastName;
        } else {
            participantsString = participantsString + ", " + participantsrArr[participantsrArr.length - i - 1].firstName + " " + participantsrArr[participantsrArr.length - i - 1].lastName;

        }
        // console.log(participantsString);
    }

    const [postedTime, setPostedTime] = useState("loading ...");

    useEffect(() => {
        // First date: March 2, 2021, at 17:25:02 UTC
        const firstDate = new Date(lastMsg?.createdAt);

        // Current date
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const difference = currentDate.getTime() - firstDate.getTime();

        // Convert milliseconds to seconds, minutes, hours, weeks, months, and years
        const secondsDifference = Math.floor(difference / 1000);
        const minutesDifference = Math.floor(difference / (1000 * 60));
        const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
        const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        const weeksDifference = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
        const monthsDifference = Math.floor(
            currentDate.getMonth() -
            firstDate.getMonth() +
            12 * (currentDate.getFullYear() - firstDate.getFullYear())
        );
        const yearsDifference = Math.floor(
            currentDate.getFullYear() - firstDate.getFullYear()
        );

        if (yearsDifference !== 0) {
            if (yearsDifference === 1) {
                setPostedTime(`${yearsDifference} year`);
            } else {
                setPostedTime(`${yearsDifference} years`);
            }
        } else {
            if (monthsDifference !== 0) {
                if (monthsDifference === 1) {
                    setPostedTime(`${monthsDifference} month`);
                } else {
                    setPostedTime(`${monthsDifference} months`);
                }
            } else {
                if (weeksDifference !== 0) {
                    if (weeksDifference === 1) {
                        setPostedTime(`${weeksDifference} week`);
                    } else {
                        setPostedTime(`${weeksDifference} weeks`);
                    }
                } else {
                    if (daysDifference !== 0) {
                        if (daysDifference === 1) {
                            setPostedTime(`${daysDifference} day`);
                        } else {
                            setPostedTime(`${daysDifference} days`);
                        }
                    }
                    else {
                        if (hoursDifference !== 0) {
                            if (hoursDifference === 1) {
                                setPostedTime(`${hoursDifference} hour`);
                            } else {
                                setPostedTime(`${hoursDifference} hours`);
                            }
                        } else {
                            if (minutesDifference !== 0) {
                                if (minutesDifference === 1) {
                                    setPostedTime(`${minutesDifference} minute`);
                                } else {
                                    setPostedTime(`${minutesDifference} minutes`);
                                }
                            } else {
                                if (secondsDifference !== 0) {
                                    if (secondsDifference === 1) {
                                        setPostedTime(`${secondsDifference} second`);
                                    } else {
                                        setPostedTime(`${secondsDifference} seconds`);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }, [lastMsg]);

    return (
        <TouchableOpacity onPress={() => navigation.navigate('MessagesPage', { chatObj: chat })} activeOpacity={0.6} style={styles.wrapper}>
            {participantsrArr.length > 1 ?
                <Svg style={{ borderRadius: 50 }} version="1.0" xmlns="http://www.w3.org/2000/svg"
                    width={45} height={45} viewBox="0 0 512.000000 512.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <G transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                        fill="#000000" stroke="none">
                        <Path d="M2425 4369 c-298 -44 -536 -248 -627 -539 -33 -108 -33 -311 0 -420
102 -327 391 -540 734 -541 132 0 213 18 333 76 160 77 268 185 350 347 61
121 78 209 73 361 -4 98 -10 138 -32 202 -39 114 -98 209 -185 296 -123 123
-268 194 -444 218 -88 12 -116 12 -202 0z m295 -189 c180 -61 323 -204 381
-382 31 -95 34 -254 5 -338 -73 -216 -221 -356 -434 -411 -193 -49 -397 4
-548 145 -79 73 -124 143 -161 248 -34 97 -36 249 -4 348 63 198 250 369 446
409 81 16 240 7 315 -19z"/>
                        <Path d="M3980 3845 c-202 -46 -378 -207 -441 -405 -25 -76 -30 -238 -10 -310
27 -98 81 -190 154 -265 82 -82 137 -117 238 -151 151 -51 303 -39 455 35 398
197 435 753 67 1005 -132 90 -312 125 -463 91z m251 -171 c76 -23 128 -56 188
-119 199 -210 131 -543 -136 -667 -174 -82 -399 -26 -515 127 -63 82 -82 144
-83 260 0 92 3 105 32 168 52 110 151 196 268 233 57 18 182 17 246 -2z"/>
                        <Path d="M891 3804 c-150 -32 -286 -124 -370 -249 -158 -236 -126 -542 76
-741 104 -103 274 -174 418 -174 249 0 489 178 566 420 32 98 30 250 -4 348
-36 103 -81 174 -159 247 -142 135 -338 190 -527 149z m299 -191 c120 -57 194
-142 232 -267 60 -196 -38 -409 -229 -499 -129 -60 -302 -47 -417 33 -61 41
-125 114 -151 173 -104 228 10 492 251 577 47 16 78 20 154 17 82 -2 104 -7
160 -34z"/>
                        <Path d="M2440 2763 c-306 -30 -599 -157 -813 -353 l-68 -63 -97 46 c-118 56
-199 81 -317 97 -469 66 -938 -224 -1092 -675 -41 -120 -53 -221 -53 -435 0
-197 0 -198 28 -251 20 -39 41 -62 77 -84 l48 -30 507 -3 508 -3 6 -40 c9 -58
38 -110 86 -153 85 -77 -22 -71 1300 -71 1322 0 1215 -6 1300 71 57 51 82 105
88 186 l5 67 501 3 c356 2 509 7 527 15 44 19 101 75 120 118 16 34 19 68 19
236 0 213 -12 314 -53 434 -104 305 -346 541 -652 638 -277 87 -600 48 -839
-100 l-49 -31 -62 53 c-283 240 -668 364 -1025 328z m326 -178 c500 -86 892
-463 995 -957 17 -84 22 -148 25 -351 5 -269 0 -313 -43 -346 -26 -21 -31 -21
-1183 -21 -1145 0 -1158 0 -1183 20 -43 34 -47 66 -43 340 3 214 7 272 25 358
103 490 492 868 986 956 108 19 312 20 421 1z m1553 -216 c298 -76 534 -313
611 -613 17 -67 20 -111 20 -286 0 -147 -3 -209 -12 -218 -9 -9 -133 -12 -499
-12 l-486 0 -6 173 c-9 250 -47 403 -153 608 -26 51 -71 125 -100 165 l-53 73
33 21 c176 108 431 143 645 89z m-3097 -63 c85 -21 218 -78 218 -92 0 -3 -19
-32 -41 -66 -59 -86 -144 -268 -174 -373 -39 -134 -55 -262 -55 -437 l0 -158
-489 0 c-417 0 -490 2 -501 15 -9 11 -11 73 -8 242 4 204 7 236 27 298 98 298
334 514 636 580 103 23 278 19 387 -9z"/>
                    </G>
                </Svg>
                :
                participantsrArr[0]?.profile?.imageURL !== '' ?
                    <Image style={{ width: 50, height: 50, borderRadius: 50 }} source={{ uri: participantsrArr[0]?.profile?.imageURL }} />
                    :
                    <Svg
                        style={{ width: 45, height: 45, borderRadius: 50 }}
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


            <View style={{ marginLeft: 10 }}>
                <Text style={{ color: '#242529', fontWeight: '600', fontSize: 16 }}>
                    {/* {lastMsg?.sender?.firstName} {lastMsg?.sender?.lastName} */}
                    {participantsString}
                </Text>
                <Text style={{ color: '#848587', fontSize: 14, fontWeight: '400', marginTop: 5 }}>
                    {lastMsg?.content?.length >= 25 ?
                        lastMsg?.content?.slice(0, 25) + '...' : lastMsg?.content
                    } •
                    <Text style={{ color: '#848587' }}> {postedTime}</Text>
                </Text>

            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    wrapper: {
        position: 'relative',
        paddingVertical: 16,
        paddingHorizontal: 18,
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
