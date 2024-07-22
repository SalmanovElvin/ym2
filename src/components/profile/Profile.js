import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  // TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal
} from "react-native";
import { TextInput } from 'react-native-paper';
import { useMutation } from "@apollo/client";
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
import { DELETE_USER, MODIFY_USER } from "../../../graph/mutations/users";
import * as ImagePicker from "expo-image-picker";
import { UPLOAD_AVATAR } from "./../../../graph/mutations/uploads";
import { ReactNativeFile } from "apollo-upload-client";

import LottieView from 'lottie-react-native';

export const Profile = ({ navigation, route }) => {
  const { signOutUserAnsStr } = route.params;

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
      <TouchableOpacity
        onPress={editData}
        activeOpacity={0.6}
        style={{ flexDirection: "row", marginRight: 10 }}
      >
        <Text style={{ color: "#0F3BAA", fontWeight: "600", fontSize: 16 }}>
          Save
        </Text>
      </TouchableOpacity>
    ),
    headerLeft: () => (
      // <Image style={{ width: 50, height: 35 }} source={logoURL} />
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
          Profile
        </Text>
      </TouchableOpacity>
    ),
  });

  const [imageFile, setImageFile] = useState(null);
  const [text, setText] = useState("");

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    setProfileImg(result.assets[0].uri);

    //
    // Fetch the file
    fetch(result.assets[0].uri)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Convert the blob to a base64 string
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .then((base64) => {
        // Create a ReactNativeFile instance
        const file = new ReactNativeFile({
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].fileName,
          // Data should be provided as a Blob or base64 string
          // For base64, we already read the file in base64 format
          // So we can directly assign the base64 string to the "data" property
          data: base64.split(",")[1], // Remove the prefix before base64 content
        });

        setImageFile(file);

        // Now you can use the ReactNativeFile instance for uploading or any other purposes
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });

    //

    setIsPhoto(false);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    setProfileImg(result.assets[0].uri);
    //
    // Fetch the file
    fetch(result.assets[0].uri)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Convert the blob to a base64 string
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .then((base64) => {
        // Create a ReactNativeFile instance
        const file = new ReactNativeFile({
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType,
          name: result.assets[0].fileName,
          // Data should be provided as a Blob or base64 string
          // For base64, we already read the file in base64 format
          // So we can directly assign the base64 string to the "data" property
          data: base64.split(",")[1], // Remove the prefix before base64 content
        });

        setImageFile(file);

        // Now you can use the ReactNativeFile instance for uploading or any other purposes
      })
      .catch((error) => {
        console.error("Error fetching file:", error);
      });

    //
    setIsPhoto(false);
  };

  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

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
          setUserProfile({ ...JSON.parse(userVal).profile });
          console.log(JSON.parse(userVal).profile);
          setName(JSON.parse(userVal)?.firstName);
          setLastName(JSON.parse(userVal)?.lastName);
          setUsername(JSON.parse(userVal)?.username);
          setEmail(JSON.parse(userVal)?.profile?.email);
          setOldEmail(JSON.parse(userVal)?.profile?.email);
          setPhone(JSON.parse(userVal)?.profile?.phone);
          setCity(JSON.parse(userVal)?.profile?.city);
          setProvince(JSON.parse(userVal)?.profile?.province);
          setPostalCode(JSON.parse(userVal)?.profile?.postalCode);
          setAddress(JSON.parse(userVal)?.profile?.address);
          setProfileImg(JSON.parse(userVal)?.profile?.imageURL);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    getData();
  }, []);

  const [name, setName] = useState(),
    [lastName, setLastName] = useState(""),
    [username, setUsername] = useState(""),
    [email, setEmail] = useState(""),
    [oldEmail, setOldEmail] = useState(""),
    [profileImg, setProfileImg] = useState(""),
    [phone, setPhone] = useState(""),
    [city, setCity] = useState(""),
    [postalCode, setPostalCode] = useState(""),
    [province, setProvince] = useState(""),
    [address, setAddress] = useState(""),
    [dateOfBirth, setDateOfBirth] = useState("");

  const [modifyUserMutation, { loading }] = useMutation(MODIFY_USER, {
    onCompleted: () => {
      setChanging(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
      console.log("changed");
    },
    onError: (error) => {
      setChanging(false);
      alert(
        "Something gone wrong when we try change data. Please try again later."
      );
    },
  });

  const modifyUser = (input) => {
    modifyUserMutation({
      variables: { unionID: userData?.unionID, userID: userData?.id, input },
    });
  };

  const editData = () => {
    setChanging(true);
    let newObj =
      oldEmail !== email
        ? {
          // dateOfBirth: "1975-04-08T20:00:00Z",
          // ...userData,
          firstName: name,
          lastName: lastName,
          username: username,
          profile: {
            // ...userProfile,
            address: address,
            city: city,
            email: email,
            // imageURL: profileImg,
            // phone: phone,
            postalCode: postalCode,
            province: province,
          },
        }
        : {
          // dateOfBirth: "1975-04-08T20:00:00Z",
          // ...userData,
          firstName: name,
          lastName: lastName,
          username: username,
          profile: {
            // ...userProfile,
            address: address,
            city: city,
            // email: email + " ",
            // imageURL: profileImg,
            phone: phone,
            postalCode: postalCode,
            province: province,
          },
        };
    AsyncStorage.setItem(
      "@USER",
      JSON.stringify({
        ...userData,
        ...newObj,
        profile: { ...userData.profile, ...newObj.profile },
      })
    );
    setUserData({
      ...userData,
      ...newObj,
      profile: { ...userData.profile, ...newObj.profile },
    });
    modifyUser(newObj);
    uploadAvatar();
  };

  const [changing, setChanging] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isPhoto, setIsPhoto] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);

  const [uploadAvatar, { error }] = useMutation(UPLOAD_AVATAR, {
    variables: {
      unionID: userData?.unionID,
      userID: userData?.id,
      file: imageFile,
    },
    onCompleted: (data) => {
      console.log(data?.uploadAvatar);

      AsyncStorage.setItem(
        "@USER",
        JSON.stringify({
          ...userData,
          profile: { ...userData.profile, imageURL: data?.uploadAvatar },
        })
      );
    },
    onError: (err) => {
      console.log(err);
      //   alert("Something gone wrong... Please try again.");
    },
  });
  const [loadingForDeleting, setLoadingForDeleting] = useState(false);
  const [removeUser] = useMutation(DELETE_USER, {
    variables: {
      unionID: userData?.unionID,
      userID: userData?.id
    },
    onCompleted: () => {
      console.log('deleted');
      setLoadingForDeleting(false);
      signOutUserAnsStr();
    },
    onError: (err) => {
      setLoadingForDeleting(false);
      alert(`${err.message}. Please contact with administrator.`);
    }
  });

  if (!userData || loadingForDeleting) {
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#EAF1F5",
      }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("QrPage", { user: userData })}
          activeOpacity={0.6}
          style={styles.qr}
        >
          <Svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Rect width="64" height="64" rx="32" fill="#5884F0" />
            <Path
              d="M28.5909 16H21.7727C21.17 16 20.5919 16.2394 20.1657 16.6657C19.7394 17.0919 19.5 17.67 19.5 18.2727V25.0909C19.5 25.6937 19.7394 26.2718 20.1657 26.698C20.5919 27.1242 21.17 27.3636 21.7727 27.3636H28.5909C29.1937 27.3636 29.7718 27.1242 30.198 26.698C30.6242 26.2718 30.8636 25.6937 30.8636 25.0909V18.2727C30.8636 17.67 30.6242 17.0919 30.198 16.6657C29.7718 16.2394 29.1937 16 28.5909 16ZM28.5909 25.0909H21.7727V18.2727H28.5909V25.0909ZM28.5909 29.6364H21.7727C21.17 29.6364 20.5919 29.8758 20.1657 30.302C19.7394 30.7282 19.5 31.3063 19.5 31.9091V38.7273C19.5 39.33 19.7394 39.9081 20.1657 40.3343C20.5919 40.7606 21.17 41 21.7727 41H28.5909C29.1937 41 29.7718 40.7606 30.198 40.3343C30.6242 39.9081 30.8636 39.33 30.8636 38.7273V31.9091C30.8636 31.3063 30.6242 30.7282 30.198 30.302C29.7718 29.8758 29.1937 29.6364 28.5909 29.6364ZM28.5909 38.7273H21.7727V31.9091H28.5909V38.7273ZM42.2273 16H35.4091C34.8063 16 34.2282 16.2394 33.802 16.6657C33.3758 17.0919 33.1364 17.67 33.1364 18.2727V25.0909C33.1364 25.6937 33.3758 26.2718 33.802 26.698C34.2282 27.1242 34.8063 27.3636 35.4091 27.3636H42.2273C42.83 27.3636 43.4081 27.1242 43.8343 26.698C44.2606 26.2718 44.5 25.6937 44.5 25.0909V18.2727C44.5 17.67 44.2606 17.0919 43.8343 16.6657C43.4081 16.2394 42.83 16 42.2273 16ZM42.2273 25.0909H35.4091V18.2727H42.2273V25.0909ZM33.1364 35.3182V30.7727C33.1364 30.4713 33.2561 30.1823 33.4692 29.9692C33.6823 29.7561 33.9713 29.6364 34.2727 29.6364C34.5741 29.6364 34.8631 29.7561 35.0763 29.9692C35.2894 30.1823 35.4091 30.4713 35.4091 30.7727V35.3182C35.4091 35.6196 35.2894 35.9086 35.0763 36.1217C34.8631 36.3348 34.5741 36.4545 34.2727 36.4545C33.9713 36.4545 33.6823 36.3348 33.4692 36.1217C33.2561 35.9086 33.1364 35.6196 33.1364 35.3182ZM44.5 33.0455C44.5 33.3468 44.3803 33.6359 44.1672 33.849C43.9541 34.0621 43.665 34.1818 43.3636 34.1818H39.9545V39.8636C39.9545 40.165 39.8348 40.4541 39.6217 40.6672C39.4086 40.8803 39.1196 41 38.8182 41H34.2727C33.9713 41 33.6823 40.8803 33.4692 40.6672C33.2561 40.4541 33.1364 40.165 33.1364 39.8636C33.1364 39.5623 33.2561 39.2732 33.4692 39.0601C33.6823 38.847 33.9713 38.7273 34.2727 38.7273H37.6818V30.7727C37.6818 30.4713 37.8015 30.1823 38.0147 29.9692C38.2278 29.7561 38.5168 29.6364 38.8182 29.6364C39.1196 29.6364 39.4086 29.7561 39.6217 29.9692C39.8348 30.1823 39.9545 30.4713 39.9545 30.7727V31.9091H43.3636C43.665 31.9091 43.9541 32.0288 44.1672 32.2419C44.3803 32.455 44.5 32.7441 44.5 33.0455ZM44.5 37.5909V39.8636C44.5 40.165 44.3803 40.4541 44.1672 40.6672C43.9541 40.8803 43.665 41 43.3636 41C43.0623 41 42.7732 40.8803 42.5601 40.6672C42.347 40.4541 42.2273 40.165 42.2273 39.8636V37.5909C42.2273 37.2895 42.347 37.0005 42.5601 36.7874C42.7732 36.5743 43.0623 36.4545 43.3636 36.4545C43.665 36.4545 43.9541 36.5743 44.1672 36.7874C44.3803 37.0005 44.5 37.2895 44.5 37.5909Z"
              fill="white"
            />
            <Path
              d="M31.7 49.42C31.7 50 31.62 50.5267 31.46 51C31.3067 51.4733 31.0767 51.8733 30.77 52.2C30.4633 52.5267 30.08 52.7667 29.62 52.92L31.33 54.7H30.04L28.66 53.09C28.62 53.09 28.5767 53.09 28.53 53.09C28.49 53.0967 28.45 53.1 28.41 53.1C27.85 53.1 27.3633 53.0133 26.95 52.84C26.5367 52.66 26.1933 52.41 25.92 52.09C25.6467 51.7633 25.4433 51.3733 25.31 50.92C25.1767 50.4667 25.11 49.9633 25.11 49.41C25.11 48.6767 25.23 48.0367 25.47 47.49C25.71 46.9433 26.0733 46.5167 26.56 46.21C27.0533 45.9033 27.6733 45.75 28.42 45.75C29.1333 45.75 29.7333 45.9033 30.22 46.21C30.7067 46.51 31.0733 46.9367 31.32 47.49C31.5733 48.0367 31.7 48.68 31.7 49.42ZM26.06 49.42C26.06 50.02 26.1433 50.5367 26.31 50.97C26.4767 51.4033 26.7333 51.7367 27.08 51.97C27.4333 52.2033 27.8767 52.32 28.41 52.32C28.95 52.32 29.39 52.2033 29.73 51.97C30.0767 51.7367 30.3333 51.4033 30.5 50.97C30.6667 50.5367 30.75 50.02 30.75 49.42C30.75 48.52 30.5633 47.8167 30.19 47.31C29.8167 46.7967 29.2267 46.54 28.42 46.54C27.88 46.54 27.4333 46.6567 27.08 46.89C26.7333 47.1167 26.4767 47.4467 26.31 47.88C26.1433 48.3067 26.06 48.82 26.06 49.42ZM35.2525 45.86C35.8458 45.86 36.3325 45.9367 36.7125 46.09C37.0992 46.2367 37.3858 46.46 37.5725 46.76C37.7592 47.06 37.8525 47.4367 37.8525 47.89C37.8525 48.27 37.7825 48.5867 37.6425 48.84C37.5025 49.0933 37.3225 49.2967 37.1025 49.45C36.8892 49.5967 36.6625 49.7133 36.4225 49.8L38.3825 53H37.3325L35.6025 50.05H34.1825V53H33.2825V45.86H35.2525ZM35.2025 46.64H34.1825V49.29H35.2525C35.6392 49.29 35.9558 49.24 36.2025 49.14C36.4492 49.0333 36.6292 48.88 36.7425 48.68C36.8625 48.48 36.9225 48.23 36.9225 47.93C36.9225 47.6167 36.8592 47.3667 36.7325 47.18C36.6125 46.9933 36.4258 46.8567 36.1725 46.77C35.9192 46.6833 35.5958 46.64 35.2025 46.64Z"
              fill="white"
              fill-opacity="0.7"
            />
          </Svg>
        </TouchableOpacity>
        {isPhoto ? (
          <View
            style={{
              zIndex: 999,
              height: "100%",
              width: "100%",
              backgroundColor: "rgba(0, 0, 50, 0.5)",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <View style={styles.modal}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={openCamera}
                  activeOpacity={0.7}
                  style={styles.conf1}
                >
                  <Text style={{ ...styles.btnConf, color: "#fff" }}>
                    Take a photo.
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openImagePicker}
                  activeOpacity={0.7}
                  style={styles.conf1}
                >
                  <Text style={{ ...styles.btnConf, color: "#fff" }}>
                    Select a photo from the library.
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsPhoto(false);
                }}
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

        <Modal visible={changing} transparent={true} animationType="fade">
          <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* You can replace this image with your animation or any other component */}
            <LottieView
              source={require("../../../animations/Animation.json")}
              autoPlay
              loop={true}
              style={styles.lottie}
            />
          </View>
        </Modal>

        <Modal visible={changing} transparent={true} animationType="fade">
          <View style={{ backgroundColor: 'rgba(255,255,255,0.7)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {/* You can replace this image with your animation or any other component */}
            <LottieView
              source={require("../../../animations/success.json")}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
          </View>
        </Modal>

        <KeyboardAvoidingView
          style={{ height: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 130}
        >
          <ScrollView style={styles.main}>
            <View style={styles.wrapper}>
              <View
                style={{
                  marginBottom: 25,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.photo}>
                  {profileImg == "" ? (
                    <View
                      style={{
                        height: 120,
                        width: 120,
                        backgroundColor: "#EDEEF1",
                        borderRadius: 100,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Svg
                        style={{ width: 70, height: 70, borderRadius: 50 }}
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
                    </View>
                  ) : (
                    <Image
                      source={{ uri: profileImg }}
                      style={{
                        width: 120,
                        height: 120,
                        zIndex: 1,
                        borderRadius: 100,
                      }}
                    />
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setIsPhoto(true);
                    }}
                    activeOpacity={0.6}
                    style={styles.photoIcon}
                  >
                    <Svg
                      width="22"
                      height="16"
                      viewBox="0 0 22 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Rect
                        x="0.429443"
                        y="2.28943"
                        width="21.1411"
                        height="13.3523"
                        rx="2"
                        fill="white"
                      />
                      <Path
                        d="M6.59779 0.838331C6.77917 0.539873 7.10311 0.357666 7.45236 0.357666H14.5477C14.8969 0.357666 15.2209 0.539873 15.4022 0.838331L16.2844 2.29002H5.71558L6.59779 0.838331Z"
                        fill="white"
                      />
                      <Circle
                        cx="11"
                        cy="8.96574"
                        r="3.57743"
                        stroke="black"
                        strokeWidth="1.2"
                      />
                      <Circle
                        cx="4.87067"
                        cy="5.35017"
                        r="0.844795"
                        fill="black"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoAndLogOutWrapper}>
                  <View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        lineHeight: 21.78,
                      }}
                    >
                      {userData.firstName}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        lineHeight: 21.78,
                      }}
                    >
                      {userData.lastName}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      signOutUserAnsStr();
                    }}
                    activeOpacity={0.6}
                    style={styles.logOut}
                  >
                    <Svg
                      width="19"
                      height="20"
                      viewBox="0 0 19 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.7723 9.99997C5.7723 9.82023 5.8437 9.64786 5.9708 9.52076C6.09789 9.39366 6.27027 9.32226 6.45001 9.32226H16.3654L14.5934 7.80419C14.5258 7.74628 14.4702 7.67561 14.4299 7.59623C14.3895 7.51684 14.3652 7.43029 14.3584 7.34152C14.3515 7.25274 14.3621 7.16348 14.3898 7.07883C14.4174 6.99418 14.4614 6.9158 14.5193 6.84816C14.5772 6.78052 14.6479 6.72495 14.7273 6.68462C14.8066 6.64429 14.8932 6.61999 14.982 6.61311C15.0708 6.60623 15.16 6.6169 15.2447 6.64452C15.3293 6.67214 15.4077 6.71615 15.4753 6.77406L18.638 9.48491C18.7124 9.54854 18.7721 9.62752 18.8131 9.71644C18.854 9.80535 18.8752 9.90208 18.8752 9.99997C18.8752 10.0979 18.854 10.1946 18.8131 10.2835C18.7721 10.3724 18.7124 10.4514 18.638 10.515L15.4753 13.2259C15.3387 13.3428 15.1613 13.4007 14.982 13.3868C14.8027 13.3729 14.6363 13.2884 14.5193 13.1518C14.4024 13.0152 14.3445 12.8377 14.3584 12.6584C14.3723 12.4791 14.4568 12.3127 14.5934 12.1958L16.3645 10.6777H6.45001C6.27027 10.6777 6.09789 10.6063 5.9708 10.4792C5.8437 10.3521 5.7723 10.1797 5.7723 9.99997Z"
                        fill="#5783EF"
                      />
                      <Path
                        d="M11.8718 6.38557C11.8718 7.01991 11.8718 7.33708 11.7191 7.56569C11.6533 7.66399 11.5689 7.74841 11.4706 7.81419C11.242 7.9669 10.9248 7.9669 10.2905 7.9669H6.45013C5.9109 7.9669 5.39377 8.1811 5.01248 8.56239C4.63119 8.94368 4.41699 9.46081 4.41699 10C4.41699 10.5393 4.63119 11.0564 5.01248 11.4377C5.39377 11.819 5.9109 12.0332 6.45013 12.0332H10.2905C10.9248 12.0332 11.242 12.0332 11.4706 12.185C11.569 12.251 11.6534 12.3358 11.7191 12.4344C11.8718 12.663 11.8718 12.9802 11.8718 13.6145C11.8718 16.1699 11.8718 17.4485 11.0775 18.2419C10.2842 19.0362 9.00646 19.0362 6.45103 19.0362H5.54741C2.99018 19.0362 1.71337 19.0362 0.919088 18.2419C0.124809 17.4485 0.124809 16.1699 0.124809 13.6145V6.38557C0.124809 3.83014 0.124809 2.55152 0.919088 1.75815C1.71337 0.963867 2.99108 0.963867 5.54651 0.963867H6.45013C9.00646 0.963867 10.2842 0.963867 11.0775 1.75815C11.8718 2.55152 11.8718 3.83014 11.8718 6.38557Z"
                        fill="#5783EF"
                      />
                    </Svg>
                    <Text style={{ color: "#242529" }}>Log out</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                mode="outlined"
                onChangeText={setName}
                value={name}
                style={styles.input}
                label="First name"
              // placeholder="First name"
              />
              <TextInput
                mode="outlined"
                onChangeText={setLastName}
                value={lastName}
                style={styles.input}
                label="Last name"
              // placeholder="Last name"
              />
              <TextInput
                mode="outlined"
                onChangeText={setUsername}
                value={username}
                style={styles.input}
                label="Username"
              // placeholder="Username"
              />
              <TextInput
                mode="outlined"
                onChangeText={setEmail}
                value={email}
                style={styles.input}
                keyboardType="email-address"
                label="Email"
              // placeholder="Email"
              />

              {/* <TextInput
              label="Type something"
              style={styles.input}
              value={email}
              onChangeText={text => setEmail(text)}
            /> */}

              <TextInput
                mode="outlined"
                onChangeText={setPhone}
                value={phone}
                style={styles.input}
                keyboardType="phone-pad"
                label="Cell phone"
              // placeholder="Cell phone"
              />
              <TextInput
                mode="outlined"
                onChangeText={setCity}
                value={city}
                style={styles.input}
                label="City"
              // placeholder="City"
              />
              <TextInput
                mode="outlined"
                onChangeText={setProvince}
                value={province}
                style={styles.input}
                label="Province"
              // placeholder="Province"
              />
              <TextInput
                mode="outlined"
                onChangeText={setAddress}
                value={address}
                style={styles.input}
                label="Address"
              // placeholder="Address"
              />
              <TextInput
                mode="outlined"
                onChangeText={setPostalCode}
                value={postalCode}
                style={styles.input}
                label="Postal code"
              // placeholder="Postal code"
              />
              <Text style={{ fontSize: 10, textAlign: "center", color: "grey" }}>
                You can change the fields below in the web version of the portal.
              </Text>
              <View
                style={{ height: 1, backgroundColor: "grey", marginBottom: 10 }}
              ></View>
              <TextInput
                mode="outlined"
                editable={false}
                value={userData?.status}
                style={styles.input}
                label="Status"
              // placeholder="Status"
              />
              <TextInput
                mode="outlined"
                editable={false}
                value={userData?.unit}
                style={styles.input}
                label="Unit"
              // placeholder="Unit"
              />
            </View>
            <TouchableOpacity onPress={() => setDeleteModal(true)} style={{ marginVertical: 15, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: '#D94D2E' }} activeOpacity={0.6}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Delete account</Text>
            </TouchableOpacity>
          </ScrollView>
          {deleteModal ?
            <View style={styles.modalBack}>
              <View style={styles.modal}>
                <Text style={styles.errMsg}>
                  Do you want to delete your account?
                </Text>
                <Text style={styles.tip}>
                  {/* more information */}
                </Text>
                <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <TouchableOpacity onPress={() => setDeleteModal(false)} activeOpacity={0.7} style={styles.noBtn}>
                    <Text style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 16
                    }}>No</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { removeUser(); setDeleteModal(false); setLoadingForDeleting(true); }} activeOpacity={0.7} style={styles.yesBtn}>
                    <Text style={{
                      color: '#fff',
                      fontWeight: '700',
                      fontSize: 16
                    }}>Yes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            :
            <></>
          }
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  modalBack: {
    zIndex: 999,
    width: '100%',
    position: "absolute",
    top: 0,
    left: 0,
    height: "110%",
    backgroundColor: 'rgba(0, 0, 50, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    width: '70%',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 15,
    justifyContent: 'space-between',
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
    fontWeight: '500',
    lineHeight: 22,
  },
  tip: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    fontStyle: 'italic',
    color: 'green',
    marginBottom: 15,
  },
  conf: {
    width: "100%",
    backgroundColor: "#34519A",
    height: 56,
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  noBtn: {
    width: "48%",
    backgroundColor: "#34519A",
    height: 56,
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  yesBtn: {
    width: "48%",
    backgroundColor: "#D94D2E",
    height: 56,
    justifyContent: "center",
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16

  },
  qr: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 900,
  },
  modal: {
    width: "80%",
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
  conf: {
    width: "100%",
    backgroundColor: "#fff",
    borderColor: "#34519A",
    borderStyle: "solid",
    borderWidth: 1,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
  },
  conf1: {
    width: "45%",
    backgroundColor: "#34519A",
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: "#34519A",
    fontWeight: "700",
    fontSize: 16,
  },
  lottie: {
    width: 80,
    height: 80,
  },
  ok: {
    padding: 15,
    fontSize: 16,
    color: "green",
    width: "70%",
    textAlign: "center",
  },
  ok2: {
    padding: 5,
    fontSize: 16,
    color: "green",
    width: "70%",
    textAlign: "center",
  },
  main: {
    paddingHorizontal: 18,
  },
  wrapper: {
    marginTop: 26,
    marginBottom: 10,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#4468c1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 11.27,
    elevation: 5,
  },
  photo: {
    position: "relative",
  },
  photoIcon: {
    height: 40,
    width: 40,
    backgroundColor: "#282827",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#F9FAFC",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 2,
  },
  infoAndLogOutWrapper: {
    width: "50%",
  },
  logOut: {
    marginTop: 20,
    flexDirection: "row",
    width: "70%",
    backgroundColor: "#5783EF26",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    marginBottom: 15,

    backgroundColor: '#fff',

    // paddingVertical: 16,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderStyle: "solid",
    // borderColor: "#BFC2CD",
    // borderRadius: 5,
  },
});
