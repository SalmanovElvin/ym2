import { AppLoading } from "expo";
import { Provider } from "react-redux";
import { useState } from "react";
import { bootstrap } from "./src/bootstrap";

import AppNavigation from "./src/navigation/AppNavigation";
import { UnionForm } from "./src/components/unionSignIn/UnionForm";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { Login } from "./src/components/login/Login";
import { SignUp } from "./src/components/signUp/SignUp";
import { EnterEmail } from "./src/components/changePassword/EnterEmail";
import { ChangePassword } from "./src/components/changePassword/ChangePassword";

import { ApolloProvider } from '@apollo/client';
import { client } from './graph';
import { UnionProvider } from './store/union-context';
import { UserProvider } from './store/user-context';
import { NotificationProvider } from './store/notification-context';
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // if (!isReady) {
  //   <AppLoading
  //     startAsync={bootstrap}
  //     onFinish={() => setIsReady(true)}
  //     onError={(err) => console.log(err)}
  //   />;
  // }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", marginVertical: 0 }}>
      <StatusBar
        barStyle='dark-content'
      />
      <ApolloProvider client={client}>
        <UnionProvider>
          <UserProvider>
            <NotificationProvider>
              {/* <ChangePassword/> */}
              {/* <EnterEmail/> */}
              {/* <SignUp/> */}
              {/* <Login/> */}
              {/* <UnionForm /> */}
              <AppNavigation />
            </NotificationProvider>
          </UserProvider>
        </UnionProvider>
      </ApolloProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  back: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF1F5",
  },
});
