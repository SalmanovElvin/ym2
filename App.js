import { AppLoading } from "expo";
import { Provider } from "react-redux";
import { useState } from "react";
import store from "./src/store";
import { bootstrap } from "./src/bootstrap";

import AppNavigation from "./src/navigation/AppNavigation";
import { UnionForm } from "./src/components/unionSignIn/UnionForm";
import { View, StyleSheet } from "react-native";
import { Login } from './src/components/login/Login';
import { SignUp } from './src/components/signUp/SignUp';
import { EnterEmail } from "./src/components/changePassword/EnterEmail";
import { ChangePassword } from "./src/components/changePassword/ChangePassword";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  if (!isReady) {
    <AppLoading
      startAsync={bootstrap}
      onFinish={() => setIsReady(true)}
      onError={(err) => console.log(err)}
    />;
  }

  return (
      <Provider store={store}>
        {/* <ChangePassword/> */}
        {/* <EnterEmail/> */}
        {/* <SignUp/> */}
        {/* <Login/> */}
        {/* <UnionForm /> */}
        <AppNavigation />
      </Provider>
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
