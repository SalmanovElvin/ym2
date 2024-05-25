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
import { RadioButton, Checkbox } from 'react-native-paper';
import { SUBMIT_VOTE } from './../../../graph/mutations/elections';

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
    const [pageNum, setPageNum] = useState(0);
    const [ballot, setBallot] = useState(null);

    // --------------------------- hold state for user votes and store ballots with options to show on comfirmation screen
    const [voteInput, setVoteInput] = useState([]);
    const [storedBallot, setStoredBallot] = useState();

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
            setBallot(data.ballots[0])
            setPageById(data.ballots[0].id);

            if (data && data.ballots) {
                const temp = [];
                const currentBallot = {};
                data.ballots.forEach((ballot) => {
                    temp.push({ ballotID: ballot.id, optionID: [] });

                    currentBallot[ballot.id] = ballot.title;
                    ballot.options &&
                        ballot.options.forEach((option) => {
                            currentBallot[option.id] = option.title;
                        });
                });
                setVoteInput(temp);
                // console.log(temp);
                setStoredBallot(currentBallot);
            }
        },
        onError: (err) => {
            refetch();
            console.log(err);
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const next = () => {
        if (checked.trim().length !== 0 || multipleChecked.length !== 0) {
            setPageById(data.ballots[pageNum + 1]?.id);
            setBallot(null);
            setBallot(data.ballots[pageNum + 1]);
            setPageNum(pageNum + 1);
            setChecked('');
            setMultipleChecked([]);
        } else {
            alert('Please, select option.')
        }
    }

    const previous = () => {
        setPageById(data.ballots[pageNum - 1]?.id);
        setBallot(null);
        setBallot(data.ballots[pageNum - 1]);
        setPageNum(pageNum - 1);
        setChecked('');
        setMultipleChecked([]);
    }


    const [checked, setChecked] = useState('');
    const [multipleChecked, setMultipleChecked] = useState([]);
    const [multipleCheckedTitles, setMultipleCheckedTitles] = useState([]);
    const [selectedValues, setSelectedValues] = useState([]);


    // --------------------------------- graphql mutation to send the votes to the database
    const [kioskVote, { loading: voteLoading, data: voteData }] = useMutation(
        SUBMIT_VOTE,
        {
            onCompleted: () => {
                setPageById(data.ballots[pageNum + 1]?.id);
                setBallot(null);
                setBallot(data.ballots[pageNum + 1]);
                setPageNum(pageNum + 1);
            },
            onError: (err) => {
                console.log(err);
            }
        }
    );

    // ---------------------------------- Running the mutation function when submit button is clicked

    const sendVote = () => {
        // const requiredInput = voteInput.filter((ballot) => ballot.optionID.length);

        const tempVoteInput = voteInput;

        data.ballots.map((ballot, i) => {
            if (
                ballot.allowAbstainType === 'yes' &&
                tempVoteInput[i].optionID.length === 0
            ) {
                const abstainOption = ballot.options.find(
                    (option) => option.name === 'Abstain'
                );
                tempVoteInput[i].optionID.push(abstainOption.id);
            }
        });

        kioskVote({
            variables: {
                unionID: userData?.unionID,
                electionID: electionId,
                votes: tempVoteInput,
                mode: 'Web'
            }
        });
    };

    return (
        <>
            <HeaderInPages title="Voting" />
            {loading ?
                <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                    <ActivityIndicator size="large" color="blue" />
                </View>
                :
                elections.length !== 0 ?
                    <ScrollView >
                        {pageNum !== elections.length + 1 ?
                            elections.filter(item => item?.id === pageById).map((item) =>
                                <View key={item.id}>
                                    <View style={{ ...styles.wrapper, marginVertical: 15 }}>
                                        <Text style={{ color: '#242529', fontSize: 16, fontWeight: '400' }}>
                                            <Text style={{ fontWeight: '600' }}>{pageNum}/{elections.length}</Text> Questions
                                        </Text>
                                        <View style={{ height: 12, width: '100%', borderRadius: 8, backgroundColor: '#DFDFDF', marginTop: 8, marginBottom: 4 }}>
                                            <View style={{ height: 12, width: `${((pageNum) / elections.length) * 100}%`, borderRadius: 8, backgroundColor: '#5BD476' }}></View>
                                        </View>
                                        <Text>{elections.length - pageNum} more to complete</Text>
                                    </View>

                                    {ballot ?
                                        <View style={{ paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#fff' }}>
                                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#242529' }}>{ballot.title}</Text>
                                            {ballot.choiceType == 'one' ?
                                                <Text style={{ fontSize: 14, fontWeight: '400', color: '#757881', marginTop: 10 }}>
                                                    You must select 1 option
                                                </Text>
                                                :
                                                <Text style={{ fontSize: 14, fontWeight: '400', color: '#757881', marginTop: 10 }}>
                                                    You may select multiple options
                                                </Text>
                                            }

                                            <View style={{ marginVertical: 20 }}>
                                                {ballot.options.map((item) =>
                                                    <TouchableOpacity key={item.id} activeOpacity={0.6} onPress={ballot.choiceType == 'one' ? () => {
                                                        setChecked(item.id);
                                                        // console.log(item.id);
                                                        let index = voteInput.findIndex(obj => obj.ballotID === pageById);
                                                        let newArr = voteInput;
                                                        if (index !== -1) {
                                                            newArr[index].optionID[0] = item.id; // Using spread syntax (...) to push multiple values
                                                        }
                                                        setVoteInput(newArr);

                                                        let newObj = new Object();
                                                        newObj.title = ballot.title;
                                                        newObj.selectedOptions = [item];
                                                        let arrayOfObjects = selectedValues;
                                                        // !arrayOfObjects.some(obj => obj.title === newObj.title) && arrayOfObjects.push(newObj);

                                                        let titleExists = arrayOfObjects.some(obj => {
                                                            if (obj.title === newObj.title) {
                                                                obj.selectedOptions = [item];
                                                                return true;
                                                            }
                                                            return false;
                                                        });

                                                        if (!titleExists) {
                                                            arrayOfObjects.push({ ...newObj, selectedOptions: [item] });
                                                        }

                                                        setSelectedValues(arrayOfObjects);
                                                    }
                                                        :
                                                        () => {
                                                            let arr = [...multipleChecked];

                                                            if (multipleChecked.length === 0 || !arr.includes(item.id)) {
                                                                arr.push(item.id);
                                                            } else {
                                                                const index = arr.indexOf(item.id);
                                                                if (index !== -1) {
                                                                    arr.splice(index, 1);
                                                                }
                                                            }

                                                            let index = voteInput.findIndex(obj => obj.ballotID === pageById);
                                                            let newArr = voteInput;
                                                            if (index !== -1) {
                                                                newArr[index].optionID = arr; // Using spread syntax (...) to push multiple values
                                                            }

                                                            // console.log(arr);
                                                            setVoteInput(newArr);
                                                            setMultipleChecked(arr);

                                                            let newObj = new Object();
                                                            newObj.title = ballot.title;
                                                            newObj.selectedOptions = arr;
                                                            let arrayOfObjects = selectedValues;

                                                            let arrOfTitles = [...multipleCheckedTitles];
                                                            if (!arrOfTitles.includes(item)) {
                                                                arrOfTitles.push(item);
                                                            } else {
                                                                const index = arrOfTitles.indexOf(item);
                                                                if (index !== -1) {
                                                                    arrOfTitles.splice(index, 1);
                                                                }
                                                            }
                                                            setMultipleCheckedTitles(arrOfTitles);

                                                            let titleExists = arrayOfObjects.some(obj => {
                                                                if (obj.title === newObj.title) {
                                                                    obj.selectedOptions = arrOfTitles;
                                                                    return true;
                                                                }
                                                                return false;
                                                            });

                                                            if (!titleExists) {
                                                                arrayOfObjects.push({ ...newObj, selectedOptions: arrOfTitles });
                                                            }

                                                            setSelectedValues(arrayOfObjects);
                                                        }} style={{ marginVertical: 10, flexDirection: "row", alignItems: 'center', borderWidth: 1, borderStyle: 'solid', borderColor: '#BFC2CD', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 5 }}>

                                                        {ballot.choiceType == 'one' ?
                                                            <RadioButton
                                                                value={item.title}
                                                                onPress={() => {
                                                                    setChecked(item.id);
                                                                    // console.log(item.id);
                                                                    let index = voteInput.findIndex(obj => obj.ballotID === pageById);
                                                                    let newArr = voteInput;
                                                                    if (index !== -1) {
                                                                        newArr[index].optionID[0] = item.id; // Using spread syntax (...) to push multiple values
                                                                    }
                                                                    setVoteInput(newArr);

                                                                    let newObj = new Object();
                                                                    newObj.title = ballot.title;
                                                                    newObj.selectedOptions = [item];
                                                                    let arrayOfObjects = selectedValues;
                                                                    // !arrayOfObjects.some(obj => obj.title === newObj.title) && arrayOfObjects.push(newObj);

                                                                    let titleExists = arrayOfObjects.some(obj => {
                                                                        if (obj.title === newObj.title) {
                                                                            obj.selectedOptions = [item];
                                                                            return true;
                                                                        }
                                                                        return false;
                                                                    });

                                                                    if (!titleExists) {
                                                                        arrayOfObjects.push({ ...newObj, selectedOptions: [item] });
                                                                    }

                                                                    setSelectedValues(arrayOfObjects);
                                                                }}
                                                                status={checked === item.id ? 'checked' : 'unchecked'}
                                                            />
                                                            :
                                                            <Checkbox
                                                                status={multipleChecked.includes(item.id) ? 'checked' : 'unchecked'}
                                                                onPress={() => {
                                                                    let arr = [...multipleChecked];

                                                                    if (multipleChecked.length === 0 || !arr.includes(item.id)) {
                                                                        arr.push(item.id);
                                                                    } else {
                                                                        const index = arr.indexOf(item.id);
                                                                        if (index !== -1) {
                                                                            arr.splice(index, 1);
                                                                        }
                                                                    }

                                                                    let index = voteInput.findIndex(obj => obj.ballotID === pageById);
                                                                    let newArr = voteInput;
                                                                    if (index !== -1) {
                                                                        newArr[index].optionID = arr; // Using spread syntax (...) to push multiple values
                                                                    }

                                                                    // console.log(arr);
                                                                    setVoteInput(newArr);
                                                                    setMultipleChecked(arr);

                                                                    let newObj = new Object();
                                                                    newObj.title = ballot.title;
                                                                    newObj.selectedOptions = arr;
                                                                    let arrayOfObjects = selectedValues;

                                                                    let arrOfTitles = [...multipleCheckedTitles];
                                                                    if (!arrOfTitles.includes(item)) {
                                                                        arrOfTitles.push(item);
                                                                    } else {
                                                                        const index = arrOfTitles.indexOf(item);
                                                                        if (index !== -1) {
                                                                            arrOfTitles.splice(index, 1);
                                                                        }
                                                                    }
                                                                    setMultipleCheckedTitles(arrOfTitles);

                                                                    let titleExists = arrayOfObjects.some(obj => {
                                                                        if (obj.title === newObj.title) {
                                                                            obj.selectedOptions = arrOfTitles;
                                                                            return true;
                                                                        }
                                                                        return false;
                                                                    });

                                                                    if (!titleExists) {
                                                                        arrayOfObjects.push({ ...newObj, selectedOptions: arrOfTitles });
                                                                    }

                                                                    setSelectedValues(arrayOfObjects);
                                                                }}
                                                            />
                                                        }
                                                        <View style={{ marginLeft: 8 }}>
                                                            <Text style={{ color: "#242529", fontWeight: '500', fontSize: 16 }}>
                                                                {item.title}
                                                            </Text>
                                                            {item.description.trim().length !== 0 ?
                                                                <View style={{ marginTop: 7, }}>
                                                                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#757881', }}>{item.description}</Text>
                                                                </View>
                                                                :
                                                                <></>
                                                            }
                                                            {item.imageURL.trim().length !== 0 ?
                                                                <View style={{ marginTop: 7, height: 146, width: 198, borderRadius: 10, overflow: 'hidden' }}>
                                                                    <Image
                                                                        style={{ height: '100%', width: '100%', borderRadius: 10 }}
                                                                        source={{ uri: item.imageURL }}
                                                                    />
                                                                </View>
                                                                :
                                                                <></>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                )}

                                            </View>

                                            {/* <RadioButton
                                                value="second"
                                                status={checked === 'second' ? 'checked' : 'unchecked'}
                                                onPress={() => setChecked('second')}
                                            /> */}

                                        </View>
                                        :
                                        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
                                            <ActivityIndicator size="large" color="blue" />
                                        </View>
                                    }
                                </View>
                            )
                            :
                            <View style={{ ...styles.wrapper, marginTop: 50 }}>
                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center', backgroundColor: '#FFFFFF',
                                    borderRadius: 20, paddingVertical: 35,
                                    paddingHorizontal: 20,
                                    shadowColor: "#4468C1",
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 7,
                                    elevation: 5,
                                }}>
                                    <Svg width={112} height={112} viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <Circle cx="56" cy="56" r="56" fill="#CAEFD4" />
                                        <Circle cx="56.0001" cy="56.0001" r="41.44" fill="#5BD476" />
                                        <Path d="M49.1572 61.8642C49.1572 61.8642 46.3658 60.1047 42.9944 57.405C42.8229 57.2675 42.6252 57.1657 42.4131 57.1056C42.201 57.0456 41.9789 57.0285 41.76 57.0554C41.5412 57.0823 41.33 57.1527 41.1391 57.2623C40.9483 57.3719 40.7816 57.5185 40.6491 57.6934C40.451 57.9551 40.3369 58.2699 40.3218 58.5969C40.3067 58.9238 40.3911 59.2476 40.5642 59.5263C42.2716 62.2768 45.2172 66.6134 47.4973 69.463C48.573 70.8072 50.4817 70.9319 51.7369 69.7499C58.9546 62.9543 65.6549 54.3813 73.6746 42.5107C73.8752 42.2189 73.9573 41.8627 73.9044 41.5134C73.8516 41.1641 73.6678 40.8475 73.3897 40.6269C73.1116 40.4063 72.7598 40.2981 72.4047 40.3238C72.0496 40.3495 71.7174 40.5073 71.4746 40.7656C62.5748 50.1136 58.0114 54.5564 49.1572 61.8642Z" fill="#F9FAFC" />
                                    </Svg>
                                    <Text style={{ color: '#5BD476', fontWeight: '600', fontSize: 18, marginTop: 10 }}>All Done!</Text>

                                    <Text style={{ color: '#242529', fontWeight: '600', fontSize: 16, marginTop: 25 }}>Your receipt ID is:</Text>
                                    <Text style={{ width: '70%', textAlign: 'center', color: '#696666', fontWeight: '400', fontSize: 18, marginTop: 10 }}>asdfg-asdasdg-asdg-sfg-asgasg-sfgdfg-fgafg</Text>
                                </View>

                                <TouchableOpacity onPress={() => navigation.navigate('Voting')} style={{ marginTop: 50, borderWidth: 1, borderColor: '#34519A', borderStyle: 'solid', backgroundColor: '#34519A', paddingVertical: 18, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} activeOpacity={0.6}>
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Finish</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginTop: 10, borderWidth: 1, borderColor: '#34519A', borderStyle: 'solid', backgroundColor: 'transparent', paddingVertical: 18, paddingHorizontal: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} activeOpacity={0.6}>
                                    <Text style={{ color: '#34519A', fontWeight: '700', fontSize: 16 }}>Send Email</Text>
                                </TouchableOpacity>
                            </View>
                        }




                        {pageNum == elections.length ?
                            <View>
                                <Text style={{ paddingVertical: 16, paddingHorizontal: 24, color: '#242529', fontSize: 18, fontWeight: '600' }}>Summary</Text>
                                <View style={{ backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 24, }}>
                                    <View style={{ marginVertical: 10, }}>
                                        <Text style={{ fontWeight: '600', fontSize: 16, color: '#242529' }}>1. Favourite color?</Text>
                                        <View style={{ marginTop: 8, borderColor: '#BFC2CD', borderWidth: 1, borderStyle: 'solid', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#242529' }}>Red</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, }}>
                                        <Text style={{ fontWeight: '600', fontSize: 16, color: '#242529' }}>1. Favourite color?</Text>
                                        <View style={{ marginTop: 8, borderColor: '#BFC2CD', borderWidth: 1, borderStyle: 'solid', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#242529' }}>Red</Text>
                                        </View>
                                    </View>
                                    <View style={{ marginVertical: 10, }}>
                                        <Text style={{ fontWeight: '600', fontSize: 16, color: '#242529' }}>1. Favourite color?</Text>
                                        <View style={{ marginTop: 8, borderColor: '#BFC2CD', borderWidth: 1, borderStyle: 'solid', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#242529' }}>Red</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            : <></>}




                        {pageNum == 0 ?
                            <View style={{ paddingVertical: 16, paddingHorizontal: 32, marginTop: 30 }}>
                                <TouchableOpacity onPress={next} style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, backgroundColor: '#34519A', borderRadius: 5 }} activeOpacity={0.6}>
                                    <Text style={{ fontWeight: '700', fontSize: 16, color: '#FFFFFF' }}>Next</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            pageNum == elections.length ?
                                <View style={{ paddingVertical: 16, paddingHorizontal: 32, marginTop: 30 }}>
                                    <TouchableOpacity onPress={sendVote} style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#5BD476', width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, backgroundColor: '#5BD476', borderRadius: 5 }} activeOpacity={0.6}>
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: '#FFFFFF' }}>Submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Voting')} style={{ marginTop: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#34519A', width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, backgroundColor: 'transparent', borderRadius: 5 }} activeOpacity={0.6}>
                                        <Text style={{ fontWeight: '700', fontSize: 16, color: '#34519A' }}>Change selection</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                pageNum < elections.length ?
                                    <View style={{ paddingVertical: 16, paddingHorizontal: 32, marginTop: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={previous} style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#34519A', width: '48%', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, backgroundColor: 'transparent', borderRadius: 5 }} activeOpacity={0.6}>
                                            <Text style={{ fontWeight: '700', fontSize: 16, color: '#34519A' }}>Back</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={next} style={{ borderStyle: 'solid', borderWidth: 1, borderColor: '#34519A', width: '48%', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 32, backgroundColor: '#34519A', borderRadius: 5 }} activeOpacity={0.6}>
                                            <Text style={{ fontWeight: '700', fontSize: 16, color: '#FFFFFF' }}>Next</Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <></>
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