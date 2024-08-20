import React, { useEffect, useState, useRef } from "react";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,

} from "react-native";
import { useQuery } from "@apollo/client";
// import Svg, {
//     G,
//     Circle,
//     Path,
//     Defs,
//     ClipPath,
//     Rect,
//     Ellipse,
//     Line,
// } from "react-native-svg";
import {
    ELECTION_REPORT,
} from "../../../graph/queries/elections";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ActualVote = ({ item, userData }) => {
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            fetchReport(); // Call fetchReport when the screen comes into focus
        }, [])
    );

    const [isVotedElection, setIsVotedElections] = useState(false);
    const [recieptId, setRecieptId] = useState('');

    // ------------------- Query to check which ballot the user already submitted
    const { refetch: fetchReport, loading } = useQuery(ELECTION_REPORT, {
        notifyOnNetworkStatusChange: true,
        variables: {
            unionID: userData?.unionID,
            electionID: item.id,
            // ballotID: id,
            reportType: 'any'
        },
        onCompleted: (data) => {
            // console.log(data?.electionReport===null);
            if (data.electionReport) {
                data.electionReport.forEach((report) => {
                    if (report.respondent.id === userData.id) {
                        setIsVotedElections(true);
                        setRecieptId(report.recieptID);
                    }
                });
            }
        },
        onError: (err) => {
            console.error(err); // eslint-disable-line
        }
    });

    useEffect(() => {
        fetchReport();
    }, [])

    const calculateDifference = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Calculate the difference in milliseconds
        const diffInMs = Math.abs(endDate - startDate);

        // Convert milliseconds to days
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

        // Calculate difference in years, months, weeks, days
        const diffInYears = Math.floor(diffInDays / 365);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInWeeks = Math.floor(diffInDays / 7);

        let result = `${diffInDays} day(s)`;

        if (diffInYears > 0) {
            result = `${diffInYears} year(s)`;
        } else if (diffInMonths > 0) {
            result = `${diffInMonths} month(s)`;
        } else if (diffInWeeks > 0) {
            result = `${diffInWeeks} week(s)`;
        }

        return result;
    };

    return (
        <>
            <View key={item.id} style={styles.block}>
                <Text
                    style={{
                        textAlign: "center",
                        marginBottom: 10,
                        color: "#242529",
                        fontSizeL: 16,
                        fontWeight: "600",
                    }}
                >
                    {item.title.toUpperCase()}
                </Text>
                <Text
                    style={{
                        textAlign: "center",
                        marginBottom: 10,
                        color: "#4A4A4A",
                        fontSizeL: 14,
                        fontWeight: "400",
                    }}
                >
                    Ends in{" "}
                    {/* {Math.floor(
                        Math.abs(
                            new Date(item.endDate) - new Date(item.startDate)
                        ) /
                        (1000 * 60 * 60 * 24)
                    )}{" "} */}
                    {calculateDifference(new Date(item.startDate), new Date(item.endDate))}|{" "}
                    {new Date(item.startDate)
                        .toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })
                        .replace(/(\d{1,2})(st|nd|rd|th)/, "$1$2")}
                </Text>
                {isVotedElection ? (
                    <>
                        <View style={{ marginVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#4A4A4A', width: '60%' }}>
                                Receipt ID:
                            </Text>
                            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#4A4A4A', width: '60%' }}>
                                {recieptId}
                            </Text>
                        </View>
                        <TouchableOpacity
                            disabled
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                backgroundColor: "grey",
                                paddingVertical: 16,
                                paddingHorizontal: 24,
                            }}
                            activeOpacity={0.6}
                        >
                            {loading ?
                                <ActivityIndicator size="small" color="#fff" />
                                :
                                <Text
                                    style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                                >
                                    You previously voted this election.
                                </Text>
                            }

                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("electionPage", {
                                electionId: item.id,
                                electiuonTitle: item.title,
                            })
                        }
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                            backgroundColor: "#34519A",
                            paddingVertical: 16,
                            paddingHorizontal: 24,
                        }}
                        activeOpacity={0.6}
                    >
                        {loading ?
                            <ActivityIndicator size="small" color="#fff" />
                            :
                            <Text
                                style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                            >
                                Vote
                            </Text>
                        }
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        flex: 1,
    },
    block: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: "#fff",
        padding: 24,
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
