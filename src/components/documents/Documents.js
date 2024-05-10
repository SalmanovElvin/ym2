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
import { DOCUMENTS } from "../../../graph/queries/documents";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width: screenWidth } = Dimensions.get("window");

export const Documents = ({ navigation, route }) => {
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
    headerRight: () => <></>,
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
          Documents
        </Text>
      </TouchableOpacity>
    ),
  });

  const [userData, setUserData] = useState(null);
  const [unionData, setUnionData] = useState("");

  const [docs, setDocs] = useState([]);
  const [docTypes, setDocTypes] = useState([]);

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

  // console.log(docTypes);

  const { data, loading, refetch } = useQuery(DOCUMENTS, {
    variables: {
      unionID: userData?.unionID,
      category: "Union-Profile",
    },
    onCompleted: () => {
      setDocs(data?.documents);
      const arr = [];
      for (let i = 0; i < data?.documents?.length; i++) {
        let isUnique = true;
        for (let j = 0; j < arr.length; j++) {
          if (data?.documents[i]?.docType === arr[j]) {
            isUnique = false;
            break;
          }
        }
        if (isUnique) {
          arr.push(data?.documents[i]?.docType);
        }
      }
      setDocTypes(arr);
    },
    onError: (error) => {
      console.error("Query Error", error); // eslint-disable-line
    },
  });
  const [selectedDoc, setSelectedDoc] = useState("YOUnified Tutorials");

  if (docTypes.length === 0) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.wrapper}>
        <Carousel
          data={docTypes}
          renderItem={({ item }) =>
            item === selectedDoc ? (
              <View
                style={{
                  borderBottomColor: "#34519A",
                  borderBottomWidth: 3,
                  borderStyle: "solid",
                }}
              >
                <Text
                  onPress={() => setSelectedDoc(item)}
                  style={{
                    textAlign: "center",
                    paddingVertical: 24,
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#696666",
                  }}
                >
                  {item === "" ? "General" : item}
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  onPress={() => setSelectedDoc(item)}
                  style={{
                    textAlign: "center",
                    paddingVertical: 24,
                    paddingHorizontal: 10,
                    fontSize: 16,
                    fontWeight: "500",
                    color: "#696666",
                  }}
                >
                  {item === "" ? "General" : item}
                </Text>
              </View>
            )
          }
          sliderWidth={screenWidth}
          itemWidth={screenWidth / 2.2}
          // onSnapToItem={index => onTabPress(docTypes[index].id)}
        />
      </View>
      <ScrollView style={{ padding: 24 }}></ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EBECF0",
  },
});
