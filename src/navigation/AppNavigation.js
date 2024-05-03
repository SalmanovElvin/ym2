import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, NativeModules } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import Svg, { G, Circle, Path, Defs, ClipPath, Rect } from "react-native-svg";

import { MainScreen } from "../screens/MainScreen";
import { FeedScreen } from "../screens/FeedScreen";
import { ServicesScreen } from "../screens/ServicesScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { THEME } from "../theme";
import { UnionForm } from "../components/unionSignIn/UnionForm";
import { Login } from "../components/login/Login";
import { EnterEmail } from "../components/changePassword/EnterEmail";
import { ChangePassword } from "../components/changePassword/ChangePassword";
import { SignUp } from "../components/signUp/SignUp";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../graph";
import { NewsFeed } from "../components/newsFeed/NewsFeed";
import { Comments } from "../components/newsFeed/Comments";
import { NotificationsPage } from "../components/notifications/NotificationsPage";
import { Chats } from "../components/chats/Chats";
import { MessagesPage } from "../components/chats/MessagesPage";
import { Profile } from "../components/profile/Profile";
import { Qr } from "../components/profile/Qr";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stil =
  Platform.OS === "android"
    ? {
      headerStyle: { backgroundColor: THEME.MAIN_COLOR },
      headerTintColor: "#fff",
    }
    : {
      headerStyle: { backgroundColor: "#fff" },
      headerTintColor: THEME.MAIN_COLOR,
    };

export default function AppNavigation() {
  /////////////////////////////////////////////////////////////
  const signOutUserAnsStr = async () => {
    try {
      // Set the value for the specified key
      await AsyncStorage.setItem("@USER", "null");
      setUserIN(false);
      setAccessToken("");
      console.log(`Value for key @USER changed successfully.`);
      // NativeModules.DevSettings.reload();
    } catch (error) {
      console.error("Error while changing AsyncStorage value:", error);
    }
  };


  function HomeNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          options={{ headerShown: false, title: "", ...stil }}
          component={MainScreen}
        />
        <Stack.Screen
          name="Notifications"
          options={{ title: "", ...stil }}
          component={NotificationsPage}
        />
        <Stack.Screen
          name="Chats"
          options={{ title: "", ...stil }}
          component={Chats}
        />
        <Stack.Screen
          name="MessagesPage"
          options={{ title: "", ...stil }}
          component={MessagesPage}
        />
        <Stack.Screen
          name="Profile"
          initialParams={{ signOutUserAnsStr }}
          options={{ title: "", ...stil }}
          component={Profile}
        />
        <Stack.Screen
          name="QrPage"
          initialParams={{ signOutUserAnsStr }}
          options={{ title: "", ...stil }}
          component={Qr}
        />
        {/* <Stack.Screen
          name="Services"
          options={{ title: "", ...stil }}
          component={ServicesScreen}
        />
        <Stack.Screen
          name="Settings"
          options={{ title: "", ...stil }}
          component={SettingsScreen}
        /> */}
      </Stack.Navigator>
    );
  }

  function FeedNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="FeedsScr"
          options={{ headerShown: false, title: "", ...stil }}
          component={FeedScreen}
        />
        <Stack.Screen
          name="NewsFeed"
          options={{ title: "", ...stil }}
          component={NewsFeed}
        />
        <Stack.Screen
          name="Comment"
          options={{ title: "", tabBarVisible: false, ...stil }}
          component={Comments}
        />
        <Stack.Screen
          name="Notifications"
          options={{ title: "", ...stil }}
          component={NotificationsPage}
        />
        <Stack.Screen
          name="Chats"
          options={{ title: "", ...stil }}
          component={Chats}
        />
        <Stack.Screen
          name="MessagesPage"
          options={{ title: "", ...stil }}
          component={MessagesPage}
        />
      </Stack.Navigator>
    );
  }

  const [userIN, setUserIN] = useState(false);



  function ServicesNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="ServicesScr"
          options={{ headerShown: false, title: "", ...stil }}
          component={ServicesScreen}
        />
        <Stack.Screen
          name="Notifications"
          options={{ title: "", ...stil }}
          component={NotificationsPage}
        />
        <Stack.Screen
          name="Chats"
          options={{ title: "", ...stil }}
          component={Chats}
        />
        <Stack.Screen
          name="MessagesPage"
          options={{ title: "", ...stil }}
          component={MessagesPage}
        />
      </Stack.Navigator>
    );
  }

  function SettingsNav() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SettingsScr"
          options={{ headerShown: false, title: "", ...stil }}
          component={SettingsScreen}
        />
        <Stack.Screen
          name="Notifications"
          options={{ title: "", ...stil }}
          component={NotificationsPage}
        />
        <Stack.Screen
          name="Chats"
          options={{ title: "", ...stil }}
          component={Chats}
        />
        <Stack.Screen
          name="MessagesPage"
          options={{ title: "", ...stil }}
          component={MessagesPage}
        />
      </Stack.Navigator>
    );
  }
  ////////////////////////////////////////////////////////////
  const [accessToken, setAccessToken] = useState("");
  // const [isLoading, setIsLoading] = useState(true);

  const getAccess = () => {
    setAccessToken("ok");
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const userVal = await AsyncStorage.getItem("@USER"); // Replace 'key' with your actual key

        if (userVal !== null && JSON.parse(userVal).username !== undefined) {
          setUserIN(true);
        } else {
          console.log("No user data found");
          setUserIN(false);
        }
      } catch (error) {
        setUserIN(false);
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);

  if (accessToken.trim().length === 0 && userIN !== true) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="unionSignIn">
          <Stack.Screen
            name="unionSignIn"
            options={{ title: "", headerShown: false, ...stil }}
            component={UnionForm}
          />
          <Stack.Screen
            name="login"
            options={{ title: "", headerShown: false, ...stil }}
            component={Login}
            initialParams={{ getAccess }}
          />
          <Stack.Screen
            name="signUp"
            options={{ title: "", headerShown: false, ...stil }}
            component={SignUp}
          />
          <Stack.Screen
            name="forgot"
            options={{ title: "", headerShown: false, ...stil }}
            component={EnterEmail}
          />
          <Stack.Screen
            name="newPassword"
            options={{ title: "", headerShown: false, ...stil }}
            component={ChangePassword}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Tab.Navigator options={{ tabBarArchiveTinColor: "red" }}>
          <Tab.Screen
            name="Home"
            component={HomeNav}
            options={{
              headerShown: false,
              title: "Home",
              tabBarIcon: (info) => (
                <Svg
                  width="23"
                  height="22"
                  viewBox="0 0 23 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M0.356995 8.74341V20.245C0.356995 20.7972 0.804711 21.245 1.357 21.245H6.96361C7.5159 21.245 7.96361 20.7972 7.96361 20.245V14.2857C7.96361 13.7334 8.41133 13.2857 8.96361 13.2857H14.127C14.6793 13.2857 15.127 13.7334 15.127 14.2857V20.245C15.127 20.7972 15.5747 21.245 16.127 21.245H21.643C22.1953 21.245 22.643 20.7972 22.643 20.245V8.74341C22.643 8.0975 22.3311 7.49136 21.8055 7.11594L12.6625 0.585223C11.9671 0.0885124 11.0329 0.0885133 10.3375 0.585224L1.19452 7.11594C0.668926 7.49136 0.356995 8.0975 0.356995 8.74341Z"
                    fill={info.color}
                  />
                </Svg>
              ),
            }}
          />
          <Tab.Screen
            name="Feed"
            options={{
              title: "Feed",
              headerShown: false,
              ...stil,
              tabBarIcon: (info) => (
                <Svg
                  width="20"
                  height="23"
                  viewBox="0 0 20 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 9.2C0 4.86335 -1.32455e-07 2.69445 1.30222 1.3478C2.60333 -1.37091e-07 4.69889 0 8.88889 0H11.1111C15.3011 0 17.3967 -1.37091e-07 18.6978 1.3478C20 2.69445 20 4.86335 20 9.2V13.8C20 18.1367 20 20.3055 18.6978 21.6522C17.3967 23 15.3011 23 11.1111 23H8.88889C4.69889 23 2.60333 23 1.30222 21.6522C-1.32455e-07 20.3055 0 18.1367 0 13.8V9.2ZM3.33333 11.5C3.33333 9.8739 3.33333 9.06085 3.82222 8.556C4.30889 8.05 5.09444 8.05 6.66667 8.05H13.3333C14.9044 8.05 15.69 8.05 16.1778 8.556C16.6667 9.06085 16.6667 9.8739 16.6667 11.5V16.1C16.6667 17.7261 16.6667 18.5391 16.1778 19.044C15.69 19.55 14.9044 19.55 13.3333 19.55H6.66667C5.09556 19.55 4.31 19.55 3.82222 19.044C3.33333 18.5403 3.33333 17.7272 3.33333 16.1V11.5ZM4.44444 3.7375C4.22343 3.7375 4.01147 3.82837 3.85519 3.99012C3.69891 4.15187 3.61111 4.37125 3.61111 4.6C3.61111 4.82875 3.69891 5.04813 3.85519 5.20988C4.01147 5.37163 4.22343 5.4625 4.44444 5.4625H10C10.221 5.4625 10.433 5.37163 10.5893 5.20988C10.7455 5.04813 10.8333 4.82875 10.8333 4.6C10.8333 4.37125 10.7455 4.15187 10.5893 3.99012C10.433 3.82837 10.221 3.7375 10 3.7375H4.44444Z"
                    fill={info.color}
                  />
                </Svg>
              ),
            }}
            component={FeedNav}
          />

          <Tab.Screen
            name="Services"
            options={{
              title: "Services",
              headerShown: false,
              ...stil,
              tabBarIcon: (info) => (
                <Svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <G clip-path="url(#clip0_1356_72)">
                    <Circle
                      cx="12.5"
                      cy="14.1112"
                      r="9.39024"
                      fill={info.color}
                    />
                    <Path
                      d="M24.8559 19.9568V19.957C24.8559 21.1758 24.3752 22.2842 23.5945 23.0995L24.8559 19.9568ZM24.8559 19.9568C24.8558 18.9013 24.4882 17.8787 23.8162 17.0647C23.1443 16.2506 22.2099 15.6959 21.1735 15.4958C20.1371 15.2956 19.0634 15.4625 18.1366 15.9677C17.2099 16.473 16.4879 17.2851 16.0947 18.2647C15.7015 19.2443 15.6616 20.3302 15.9819 21.336C16.3021 22.3418 16.9625 23.2047 17.8496 23.7767C18.7368 24.3486 19.7954 24.5938 20.8437 24.4703C21.8919 24.3467 22.8644 23.8622 23.5943 23.0997L24.8559 19.9568ZM9.23232 19.9568V19.957C9.23232 21.1758 8.75161 22.2842 7.97087 23.0995L9.23232 19.9568ZM9.23232 19.9568C9.23218 18.9013 8.86459 17.8787 8.19264 17.0647C7.5207 16.2506 6.58632 15.6959 5.54993 15.4958C4.51353 15.2956 3.43979 15.4625 2.51303 15.9677C1.58628 16.473 0.864327 17.2851 0.471136 18.2647C0.0779444 19.2443 0.0380392 20.3302 0.358271 21.336C0.678503 22.3418 1.33889 23.2047 2.22607 23.7767C3.11324 24.3486 4.17184 24.5938 5.22013 24.4703C6.26833 24.3467 7.24083 23.8622 7.9707 23.0997L9.23232 19.9568ZM17.0441 5.04208V5.04221C17.0441 6.26105 16.5634 7.36946 15.7827 8.18478L17.0441 5.04208ZM17.0441 5.04208C17.044 3.98654 16.6764 2.96396 16.0044 2.14992C15.3325 1.33588 14.3981 0.781161 13.3617 0.580994C12.3253 0.380828 11.2516 0.547704 10.3248 1.05297C9.39806 1.55824 8.67612 2.37039 8.28293 3.34996C7.88974 4.32954 7.84983 5.41545 8.17006 6.42124C8.49029 7.42704 9.15069 8.28998 10.0379 8.86191C10.925 9.43384 11.9836 9.67907 13.0319 9.55551C14.0801 9.43197 15.0526 8.94739 15.7825 8.18497L17.0441 5.04208Z"
                      fill={info.color}
                      stroke="#F9FAFC"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </G>
                  <Defs>
                    <ClipPath id="clip0_1356_72">
                      <Rect width="25" height="25" fill="white" />
                    </ClipPath>
                  </Defs>
                </Svg>
              ),
            }}
            component={ServicesNav}
          />

          <Tab.Screen
            name="Settings"
            options={{
              title: "Settings",
              headerShown: false,
              ...stil,
              tabBarIcon: (info) => (
                <Svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Path
                    d="M11.5287 0.769584C12.1328 0.434004 12.8672 0.434003 13.4713 0.769584L22.5143 5.79347C23.1492 6.14621 23.543 6.81545 23.543 7.54179V17.4582C23.543 18.1845 23.1492 18.8537 22.5143 19.2065L13.4713 24.2304C12.8672 24.566 12.1328 24.566 11.5287 24.2304L2.48572 19.2065C1.85079 18.8537 1.457 18.1845 1.457 17.4582V7.54179C1.457 6.81545 1.85078 6.14621 2.48571 5.79347L11.5287 0.769584ZM12.5 15.8463C13.4249 15.8463 14.3119 15.4938 14.9659 14.8662C15.6199 14.2386 15.9873 13.3875 15.9873 12.5C15.9873 11.6125 15.6199 10.7613 14.9659 10.1337C14.3119 9.50618 13.4249 9.15361 12.5 9.15361C11.5751 9.15361 10.6881 9.50618 10.0341 10.1337C9.38014 10.7613 9.01273 11.6125 9.01273 12.5C9.01273 13.3875 9.38014 14.2386 10.0341 14.8662C10.6881 15.4938 11.5751 15.8463 12.5 15.8463Z"
                    fill={info.color}
                  />
                </Svg>
              ),
            }}
            component={SettingsNav}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
