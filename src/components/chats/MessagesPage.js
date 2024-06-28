import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
  SafeAreaView
} from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATS, GET_MESSAGES } from "./../../../graph/queries/messages";
import { Message } from "./Message";
import { SEND_MESSAGE } from "./../../../graph/mutations/messages";

export const MessagesPage = ({ navigation, route }) => {
  const { chatObj } = route.params;

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
      alignItems: "center",
      justifyContent: "center",
    },
    headerRight: () => (
      <></>
      // <TouchableOpacity onPress={readNotificationAll} activeOpacity={0.6} style={{ flexDirection: "row", marginRight: 10 }}>
      //     <Text style={{ color: '#0F3BAA', fontWeight: '600', fontSize: 16 }}>Read all</Text>
      // </TouchableOpacity>
    ),
    headerLeft: () => (
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
          Chats
        </Text>
      </TouchableOpacity>
    ),
  });

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

  const [msgs, setMsgs] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES, {
    variables: {
      unionID: userData?.unionID,
      chatID: chatObj?.id,
    },
    onCompleted: () => {
      setMsgs(data?.messages);
      // console.log(data?.messages[0]);
    },
    notifyOnNetworkStatusChange: true,
    pollInterval: 9000,
  });
  const [newMsgContent, setNewMsgContent] = useState("");

  const [sendMsg, { loading2 }] = useMutation(SEND_MESSAGE, {
    variables: {
      unionID: userData?.unionID,
      message: {
        chatID: chatObj?.id,
        unionID: userData?.unionID,
        senderID: userData?.id,
        content: "" + newMsgContent,
        users: chatObj?.participants?.map((p) => p.id),
      },
    },
    onCompleted: () => {
      console.log("Sended");
      setTimeout(() => {
        refetch();
      }, 1000);
    },
    onError: (err) => {
      console.error(err); // eslint-disable-line
    },
  });

  const [idForNewMsg, setIdForNewMsg] = useState(0);
  const sendNewMessage = () => {
    // console.log(userData);

    if (newMsgContent.trim().length !== 0) {
      sendMsg();
      // setMsgs([]);
      setMsgs([
        ...msgs,
        {
          __typename: "Message",
          content: "" + newMsgContent,
          createdAt: new Date(),
          id: "" + idForNewMsg,
          sender: {
            __typename: "User",
            firstName: userData?.firstName,
            id: userData?.id,
            lastName: userData?.lastName,
            profile: {
              __typename: "Info",
              imageURL: userData?.profile?.imageURL,
            },
          },
        },
      ]);
      setIdForNewMsg(idForNewMsg + 1);
      setNewMsgContent("");
      Keyboard.dismiss();
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      width: "100%",
      backgroundColor: "#EAF1F5",
    }}>
      <KeyboardAvoidingView
        style={{ height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 130}
      >
        {msgs.length === 0 ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <View style={styles.mainWrapper}>
            <FlatList
              inverted
              style={{ height: "90%" }}
              data={[...msgs].reverse()}
              renderItem={({ item }) => <Message msg={item} />}
              keyExtractor={(item) => item?.id}
            />
          </View>
        )}

        <View style={styles.newCommentWrapper}>
          <TextInput
            value={newMsgContent}
            style={styles.newCommentInput}
            onChangeText={setNewMsgContent}
            placeholder="Write a message"
          />
          <TouchableOpacity activeOpacity={0.6} onPress={sendNewMessage}>
            <Svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Rect width="40" height="40" rx="20" fill="#34519A" />
              <Path
                d="M9.80732 17.8679C9.03653  18.1404 8.94011 19.1901 9.64753 19.5996L14.8199 22.588C14.9498 22.6632 15.099 22.6985 15.2488 22.6897C15.3986 22.6808 15.5426 22.6281 15.6627 22.5381L21.7814 17.9491C21.958 17.8159 22.1822 18.0401 22.0495 18.2173L17.4605 24.3348C17.3705 24.455 17.3179 24.5989 17.309 24.7488C17.3001 24.8986 17.3355 25.0478 17.4107 25.1777L20.4007 30.3528C20.8096 31.0596 21.8594 30.9632 22.1324 30.193L28.2256 12.9967C28.4948 12.2378 27.7625 11.5055 27.003 11.7742L9.80732 17.8679Z"
                fill="white"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  newCommentWrapper: {
    position: Platform.OS === "ios" ? "relative" : "absolute",
    bottom: 0,
    left: 0,
    height: 65,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  newCommentInput: {
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#EAEBF0",
    fontSize: 16,
    fontWeight: "400",
    color: "#696666",
    width: "85%",
  },
  mainWrapper: {
    paddingTop: 20,
    paddingHorizontal: 7,
  },
  wrapper: {
    position: "relative",
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    width: "70%",
    marginBottom: 15,
    // borderLeftColor:'#4468C1',
    // borderLeftWidth:10
  },
});
