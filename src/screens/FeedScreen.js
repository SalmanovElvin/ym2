import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import { useUnionState } from "../../store/union-context";
import { useUserState } from "../../store/user-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsFeed } from "../components/newsFeed/NewsFeed";

import { GET_NEWS } from "../../graph/queries/news";
import { useQuery } from "@apollo/client";

export const FeedScreen = ({ navigation }) => {
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
    },
    headerRight: () => (
      <View style={{ flexDirection: "row", marginRight: 10 }}>
        <Svg
          style={{ marginRight: 20 }}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M23.3611 21.588C22.1684 20.0769 21.3263 19.3077 21.3263 15.1418C21.3263 11.3269 19.4442 9.96779 17.8951 9.30769C17.6894 9.22019 17.4957 9.01923 17.433 8.80048C17.1612 7.84327 16.3995 7 15.3869 7C14.3743 7 13.6121 7.84375 13.3432 8.80144C13.2805 9.0226 13.0868 9.22019 12.881 9.30769C11.3301 9.96875 9.44991 11.3231 9.44991 15.1418C9.44758 19.3077 8.60548 20.0769 7.41269 21.588C6.91848 22.2139 7.35138 23.1538 8.21578 23.1538H22.5627C23.4225 23.1538 23.8526 22.2111 23.3611 21.588Z"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M17.4889 26.0988C18.0464 25.5218 18.3596 24.7391 18.3596 23.9231H12.4142C12.4142 24.7391 12.7274 25.5218 13.2849 26.0988C13.8424 26.6758 14.5985 27 15.3869 27C16.1753 27 16.9314 26.6758 17.4889 26.0988Z"
            fill="#757881"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="20.7955"
            cy="9"
            r="5"
            fill="#ED1717"
            stroke="#F9FAFC"
            strokeWidth="2"
          />
        </Svg>

        <Svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M18.2222 19.3334V21.5556C18.2222 21.8503 18.1052 22.1329 17.8968 22.3413C17.6884 22.5497 17.4058 22.6667 17.1111 22.6667H9.33333L6 26.0001V14.8889C6 14.5943 6.11706 14.3116 6.32544 14.1033C6.53381 13.8949 6.81643 13.7778 7.11111 13.7778H9.33333"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M26 18.2222L22.6667 14.8889H14.8889C14.5942 14.8889 14.3116 14.7718 14.1032 14.5635C13.8948 14.3551 13.7778 14.0725 13.7778 13.7778V7.11111C13.7778 6.81643 13.8948 6.53381 14.1032 6.32544C14.3116 6.11706 14.5942 6 14.8889 6H24.8889C25.1836 6 25.4662 6.11706 25.6746 6.32544C25.8829 6.53381 26 6.81643 26 7.11111V18.2222Z"
            fill="#757881"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    ),
    headerLeft: () => (
      <Image style={{ width: 50, height: 35 }} source={logoURL} />
    ),
  });

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


  const getNewsFunc = () => {
    setNewsFeed([]);
    setTimeout(() => {
      refetch();
      setIsFetching(true);
    }, 500);
  }

  return (
    <View style={styles.wrapper}>
      {newsFeed.length === 0 ? (
        <View
          style={{ height: '100%', justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <>
          {/* <NewsFeed news={newsFeed[0]} />
          <NewsFeed news={newsFeed[1]} />
          <NewsFeed news={newsFeed[2]} />
          <NewsFeed news={newsFeed[3]} />
          <NewsFeed news={newsFeed[4]} />
          <NewsFeed news={newsFeed[5]} />
          <NewsFeed news={newsFeed[6]} />
          <NewsFeed news={newsFeed[7]} /> */}

          <FlatList
            data={newsFeed}
            renderItem={({ item }) => <NewsFeed getNews={getNewsFunc} key={item?.id} news={item} />}
            keyExtractor={({ item }) => item?.id}
          />

          {/* {newsFeed.map((newsItem, index) => (
            <View key={index}>
              <NewsFeed news={newsItem} />
            </View>
          ))} */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
  },
});
