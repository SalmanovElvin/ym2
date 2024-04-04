import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { MainScreen } from "../screens/MainScreen";
import { BookedScreen } from "../screens/BookedScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { CreateScreen } from "../screens/CreateScreen";
import { PostScreen } from "../screens/PostScreen";
import { THEME } from "../theme";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
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

function Nav() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        options={{ title: "Главная страница", ...stil }}
        component={MainScreen}
      />
      <Stack.Screen
        name="Booked"
        options={{ title: "Избранные", ...stil }}
        component={BookedScreen}
      />
      <Stack.Screen
        name="About"
        options={{ title: "Информация", ...stil }}
        component={AboutScreen}
      />
      <Stack.Screen
        name="Create"
        options={{ title: "Создать", ...stil }}
        component={CreateScreen}
      />
      <Stack.Screen
        name="Post"
        options={{ title: "Пост номер 47", ...stil }}
        component={PostScreen}
      />
      {/* <Stack.Screen name="Root" component={Root} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
}

function Root() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Main"
        options={{ headerShown: false, title: "Главная", ...stil }}
        component={Nav}
      />
      <Drawer.Screen
        name="About"
        options={{ title: "О приложении", ...stil }}
        component={AboutScreen}
      />
      <Drawer.Screen
        name="Create"
        options={{ title: "Создать", ...stil }}
        component={CreateScreen}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator options={{ tabBarArchiveTinColor: "red" }}>
        {/* <Tab.Screen
          name="Home"
          component={Nav}
          options={{
            headerShown: false,
            // tabBarShowLabel: false,
            title: "Главная",
            tabBarIcon: (info) => (
              <Ionicons name="albums" color={info.color} size={24} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Home"
          component={Root}
          options={{
            headerShown: false,
            title: "Главная",
            tabBarIcon: (info) => (
              <Ionicons name="albums" color={info.color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Booked"
          options={{
            title: "Избранные",
            ...stil,
            tabBarIcon: (info) => (
              <Ionicons name="star" color={info.color} size={24} />
            ),
          }}
          component={BookedScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
