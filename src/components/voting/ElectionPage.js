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
import { FETCH_BALLOTS } from "../../../graph/queries/elections";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const ElectionPage = ({ navigation, route }) => {

    const { electionId } = route.params;
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

    const [elections, setElections] = useState([]);
    const [pageById, setPageById] = useState('');
    const [pageNum, setPageNum] = useState(1);


    const {
        data,
        loading,
        error,
        refetch
    } = useQuery(FETCH_BALLOTS, {
        variables: {
            unionID: userData?.unionID,
            electionID: electionId
        },
        onCompleted: (data) => {
            setElections(data.ballots);
            setPageById(data.ballots[0].id);
        },
        onError: (err) => {
            refetch();
            console.log(err);
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });


    const next = () => {
        setPageById(data.ballots[pageNum]?.id)
        setPageNum(pageNum + 1);
    }

    return (
        <>
            <HeaderInPages title="Voting" />
            {loading ?
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
                :
                elections.length !== 0 ?
                    <ScrollView style={styles.wrapper}>
                        {pageNum+1 !== elections.length ?
                            elections.filter(item => item?.id === pageById).map((item) =>
                                <Text onPress={next}>Salam {pageById}</Text>
                            )
                            :
                            <Text>End of elections</Text>
                        }

                    </ScrollView>
                    :
                    <Text style={{ padding: 15, textAlign: 'center', fontWeight: '700', fontSize: 16, color: '#696666' }}>Something gone wrong.</Text>

            }
        </>
    );
};
const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 15,
        paddingHorizontal: 18,
        flex: 1
    },
    block: {
        marginBottom: 20,
        borderRadius: 15,
        backgroundColor: '#fff',
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
