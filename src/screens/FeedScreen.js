import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import { useUnionState } from "../../store/union-context";
import { useUserState } from "../../store/user-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsFeed } from "../components/newsFeed/NewsFeed";

import { GET_NEWS } from "../../graph/queries/news";
import { useQuery } from "@apollo/client";
import { Header } from "../components/header/Header";

export const FeedScreen = ({ navigation, route }) => {
  const union = useUnionState();
  const userState = useUserState();

  const [userData, setUserData] = useState(null);
  const [unionData, setUnionData] = useState("");

  const [logoURL, setLogoURL] = useState("");
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

        if (value !== null) {
          setLogoURL({ uri: `${JSON.parse(value).information.imageURL}` });
          setUnionData(JSON.parse(value));
          // console.log('Retrieved data:', JSON.parse(value).information.imageURL);
        } else {
          console.log("No union data found");
        }

        const userVal = await AsyncStorage.getItem("@USER"); // Replace 'key' with your actual key

        if (userVal !== null && JSON.parse(userVal).username !== undefined) {
          setUserData(JSON.parse(userVal));
          // navigation.navigate('Home');
          // console.log(JSON.parse(userVal).username);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);

  const [newsFeed, setNewsFeed] = useState([]);
  // const [newsTest, setNewsTest] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  //query
  const { data, loading, error, refetch } = useQuery(GET_NEWS, {
    variables: {
      unionID: unionData.id,
      page: 1,
      perpage: 999,
      category: "",
    },
    onCompleted: () => {
      if (
        data &&
        data.newsFeed &&
        data.newsFeed.data &&
        data.newsFeed.data.length
      ) {
        setNewsFeed([...data.newsFeed.data]);
        setRefreshing(false);

      }
      if (
        data &&
        data.newsFeed &&
        data.newsFeed.data &&
        data.newsFeed.data.length &&
        data.newsFeed.pinned &&
        data.newsFeed.pinned.length
      ) {
        setNewsFeed([...data.newsFeed.pinned, ...data.newsFeed.data]);
        setRefreshing(false);

        // console.log([...data.newsFeed.pinned, ...data.newsFeed.data]);
        // for(let i=0;i<[...data.newsFeed.pinned, ...data.newsFeed.data].length;i++){

        //   arr.push([...data.newsFeed.pinned, ...data.newsFeed.data][i].creator.profile);
        // }
        // console.log(arr);
      }
      setIsFetching(false);
    },
    onError: (err) => {
      console.log(err);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    refetch();
    setIsFetching(true);
  }, []);

  const arrToNull = () => {
    setNewsFeed([]);
  }

  const getNewsFunc = () => {
    // setNewsFeed([]);
    setTimeout(() => {
      refetch();
      setIsFetching(true);
    }, 300);
  };

  const showErr = () => {
    setErrMsg("You do not have access to pin or unpin news.");
    setTip("Only admin accounts can perform this operation.");
    setErrUser(true);
  };

  const openComments = (newsID, userData, commentCount) => {
    // console.log(newsFeed.find(item => item.id === newsID));
    navigation.navigate("Comment", {
      news: newsFeed.find((item) => item.id === newsID),
      userData: userData,
      logoURL: logoURL,
      commentCount: commentCount,
    });
  };

  const [errUser, setErrUser] = useState(false);
  const [errMsg, setErrMsg] = useState(""),
    [tip, setTip] = useState("");

  const scrollViewRef = useRef();

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNewsFunc();
  }, []);

  // For notifications



  return (
    <>
      <Header />
      <SafeAreaView style={{ flex: 1, }}>
        {errUser ? (
          <View style={styles.modalBack}>
            <View style={styles.modal}>
              <Text style={styles.errMsg}>{errMsg}</Text>
              <Text style={styles.tip}>{tip}</Text>
              <TouchableOpacity
                onPress={() => setErrUser(false)}
                activeOpacity={0.7}
                style={styles.conf}
              >
                <Text style={styles.btnConf}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <></>
        )}
        <ScrollView style={styles.wrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>

          {
            newsFeed.length === 0 ? (
              <View
                style={{
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20
                }}
              >
                <ActivityIndicator size="large" color="blue" />
              </View>
            ) : (
              <>
                {newsFeed.map((item) => (
                  <NewsFeed
                    openComments={openComments}
                    showErr={showErr}
                    getNews={getNewsFunc}
                    setNewsArrToNull={arrToNull}
                    key={item?.id}
                    news={item}
                  />
                ))}


                {/* <FlatList
                  data={newsFeed}
                  renderItem={({ item }) => (
                    <NewsFeed
                      openComments={openComments}
                      showErr={showErr}
                      getNews={getNewsFunc}
                      key={item?.id}
                      news={item}
                    />
                  )}
                  keyExtractor={(item) => item?.id}
                /> */}
              </>
            )
          }
        </ScrollView>

      </SafeAreaView>
    </>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  modalBack: {
    zIndex: 999,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 50, 0.5)",
    height: screenHeight - 150,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    width: "70%",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 15,
    justifyContent: "space-between",
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
    fontWeight: "500",
    lineHeight: 22,
  },
  tip: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    fontStyle: "italic",
    color: "green",
    marginBottom: 15,
  },
  conf: {
    width: "100%",
    backgroundColor: "#34519A",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  wrapper: {

  },
});