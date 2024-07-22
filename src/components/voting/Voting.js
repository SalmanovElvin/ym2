import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import {  useQuery } from "@apollo/client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderInPages } from "./../header/HeaderInPages";
import {
 
  GET_ELECTIONS,
} from "../../../graph/queries/elections";
import { ActualVote } from "./ActualVote";

// const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Voting = ({ navigation, route }) => {

  const [userData, setUserData] = useState(null);
  const [unionData, setUnionData] = useState("");

  useEffect(() => {
    refetch();
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

  const [actualElections, setActualElections] = useState([]),
    [expiredElections, setExpiredElections] = useState([]);
  const [votedElections, setVotedElections] = useState([]);
  const [electionId, setElectionId] = useState('');


  const {
    data: electionsData,
    loading: electionsLoading,
    error: electionsError,
    refetch,
  } = useQuery(GET_ELECTIONS, {
    variables: {
      unionID: userData?.unionID,
    },
    onCompleted: (data) => {
      // let actArr = electionsData.elections.filter(
      //   (election) => new Date(election.endDate) > new Date()
      // );
      // for (let i = 0; i < actArr?.length; i++) {
      //   setElectionId(actArr[i].id);
      // }

      setActualElections(
        electionsData.elections.filter(
          (election) => new Date(election.endDate) > new Date()
        )
      );

      setExpiredElections(
        electionsData.elections.filter(
          (election) => new Date(election.endDate) < new Date()
        )
      );
      setRefreshing(false);
    },
    onError: (err) => {
      refetch();
      console.log(err);
      setRefreshing(false);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });


  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setActualElections([]);
    setExpiredElections([]);
    refetch();
    setRefreshing(true);
  }, []);

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#EAF1F5",
      }}>
        <HeaderInPages title="Voting" />
        {electionsLoading ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <SafeAreaView style={{ flex: 1, }}>
            <ScrollView refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => {
                onRefresh();
              }} />
            } style={styles.wrapper}>
              {actualElections.length !== 0 ? (
                actualElections.map((item) => (
                  <ActualVote userData={userData} key={item.id} item={item} />
                ))
              ) : (
                <Text
                  style={{
                    padding: 15,
                    textAlign: "center",
                    fontWeight: "700",
                    fontSize: 16,
                    color: "#696666",
                  }}
                >
                  There are no any actual votings.
                </Text>
              )}

              {expiredElections.length === 0 ? (
                <></>
              ) : (
                <>
                  <Text
                    style={{
                      paddingVertical: 10,
                      textAlign: "center",
                      marginBottom: 15,
                      color: "#242529",
                      fontSize: 18,
                      fontWeight: "700",
                      borderBottomColor: "#242529",
                      borderBottomWidth: 1,
                      borderStyle: "solid",
                    }}
                  >
                    Elections that was expired:
                  </Text>
                  {expiredElections.map((item) => (
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
                        Ended in{" "}
                        {Math.ceil(
                          Math.abs(
                            new Date(item.endDate) - new Date(item.startDate)
                          ) /
                          (1000 * 60 * 60 * 24)
                        )}{" "}
                        day(s) |{" "}
                        {new Date(item.startDate)
                          .toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          .replace(/(\d{1,2})(st|nd|rd|th)/, "$1$2")}
                      </Text>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#4A4A4A",
                          marginBottom: 10,
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        End Date:{" "}
                        {new Date(item.endDate)
                          .toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                          .replace(/(\d{1,2})(st|nd|rd|th)/, "$1$2")}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </SafeAreaView>
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
