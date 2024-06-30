import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  Modal,
  Animated, Easing
} from "react-native";
import { useMutation } from "@apollo/client";

import { LOGIN_USER } from "../../../graph/mutations/users";
import { useUnionState } from "../../../store/union-context";
import { useUserDispatch } from "../../../store/user-context";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from 'lottie-react-native';

export const Login = ({ navigation, route }) => {
  const { getAccess } = route.params;

  const openUnionLogin = () => {
    navigation.navigate("unionSignIn");
  };

  const [unionState, setUnionState] = useState(useUnionState());
  // console.log(unionState.information.imageURL);
  const [logoURL, setLogoURL] = useState("");
  // if(unionState!==null){
  //   setLogoURL({
  //     uri: `${unionState.information.imageURL}`,
  //   });
  // }

  const [loginInfo, setLoginInfo] = useState({});
  const userDispatch = useUserDispatch();
  const [loginUser, { loading, error, data }] = useMutation(LOGIN_USER, {
    onCompleted: () => {
      // console.log(data.login.user);
      setVisible(false);

      userDispatch({ type: "LOGIN", payload: data.login.user });
      getAccess();
    },
    variables: {
      input: loginInfo,
      device: "mobile",
    },
    onError: (err) => {
      // console.error(err.message);
      if (
        err.message.includes(
          "Your account is pending approval, you will receive an email"
        )
      ) {
        setVisible(false);

        setErrMsg(
          <>
            Account is pending approval. We will send an email to the personal
            email you used when you registered once your account has been
            verified. Thank you for your patience.
          </>
        );
        setTip("");
        setErrUser(true);
      }
      if (
        err.message.includes(
          "Account has been locked. Please reset your password. If you are"
        )
      ) {
        setVisible(false);

        setErrMsg(
          <>
            Account has been locked. Please click on{" "}
            <Text
              onPress={() => {
                navigation.navigate("forgot");
                setErrUser(false);
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Forgot Password?
            </Text>{" "}
            and enter in the username or personal email associated with your
            account to reset your password.
          </>
        );
        setTip("");
        setErrUser(true);
      }
      if (err.message.includes("Login attempt failed.")) {
        setVisible(false);

        setErrMsg(
          <>
            Incorrect password. You have {parseInt(err.message.match(/\d+/)[0])}{" "}
            more attempts before your account is locked. If you forget your
            password, please click on{" "}
            <Text
              onPress={() => {
                navigation.navigate("forgot");
                setErrUser(false);
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Forgot Password?
            </Text>{" "}
            to reset.
          </>
        );
        setTip("");
        setErrUser(true);
      }
      if (
        err.message.includes(
          "Account with this username or email does not exist"
        )
      ) {
        setVisible(false);

        setErrMsg(
          <>
            Account with this username/email does not exist. If you are a new
            member, please{" "}
            <Text
              onPress={() => {
                navigation.navigate("signUp");
                setErrUser(false);
              }}
              style={{ textDecorationLine: "underline" }}
            >
              Register
            </Text>
          </>
        );
        setTip(
          "Hint: you can also sign in with the personal email associated with your account."
        );
        setErrUser(true);
      }
    },
  });

  const loginHandler = () => {
    if (username.trim().length !== 0 && password.trim().length !== 0) {
      setVisible(true);
      Keyboard.dismiss();
      setLoginInfo({
        email: username.trim(),
        username: username.trim(),
        unionID: unionState.id,
        password: password.trim(),
      });
      // console.log(loginInfo);
      loginUser({
        variables: {
          input: {
            email: username.trim(),
            username: username.trim(),
            unionID: unionState.id,
            password: password.trim(),
          },
          device: "mobile",
        },
      });
    } else {
      Keyboard.dismiss();
      setErrMsg("Please provide both username and password");
      setTip("");
      setErrUser(true);
      setVisible(false);
    }
  };

  //////////////////////////////////////////////////////////////////////

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("UNION"); // Replace 'key' with your actual key

        if (value !== null) {
          setLogoURL({ uri: `${JSON.parse(value).information.imageURL}` });
          setUnionState(JSON.parse(value));
          // console.log('Retrieved data:', JSON.parse(value).information.imageURL);
        } else {
          console.log("No union data found");
        }

        const userVal = await AsyncStorage.getItem("@USER"); // Replace 'key' with your actual key

        if (userVal !== null && JSON.parse(userVal)?.username !== undefined) {
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

  //This is for using AsyncStorage

  // // Define the key
  // const UNION_KEY = 'UNION';

  // // Function to get item from AsyncStorage with UNION key
  // const getUnionItem = async () => {
  //   try {
  //     // Retrieve item from AsyncStorage
  //     const item = await AsyncStorage.getItem(UNION_KEY);

  //     const data = JSON.parse(item);

  //     // Access the id property
  //     const id = data.id;

  //     // Check if item exists
  //     if (item !== null) {
  //       // Item found, do something with it
  //       console.log(id);
  //     } else {
  //       // Item not found
  //       console.log('No item found with key:', UNION_KEY);
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //     console.error('Error getting item from AsyncStorage:', error);
  //   }
  // };

  // // Call the function to get item from AsyncStorage
  // getUnionItem();

  //////////////////////////////////////////////////////////////////////////

  // State variable to hold the password
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // State variable to track password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle the password visibility state
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [errUser, setErrUser] = useState(false);
  const [errMsg, setErrMsg] = useState(""),
    [tip, setTip] = useState("");

  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#EAF1F5",
    }}>
      <View style={styles.mainContUnion}>
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
        <View style={{ alignItems: 'center', marginTop: 25, marginBottom: 60 }}>
          {logoURL === "" ? <ActivityIndicator size="large" color="blue" /> : <Image
            style={{ width: 100, height: 100, borderRadius: 20 }}
            source={logoURL}
          />}

        </View>
        <View style={styles.mainFormUnion}>
          <Text style={styles.header}>Log into your account</Text>
          <TextInput
            onChangeText={setUsername}
            style={styles.input}
            keyboardType="email-address"
            placeholder="Login"
          />
          <View style={styles.container}>
            <TextInput
              // Set secureTextEntry prop to hide
              //password when showPassword is false
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.inputP}
              placeholder="Password"
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>
          <Text
            onPress={() => navigation.navigate("forgot")}
            style={styles.forgot}
          >
            Forgot password?
          </Text>

          <Modal visible={visible} transparent={true} animationType="fade">
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
          <TouchableOpacity
            onPress={loginHandler}
            activeOpacity={0.7}
            style={styles.conf}
          >
            <Text style={styles.btnConf}>Sign in</Text>
          </TouchableOpacity>

          <Text style={styles.create}>
            If you don’t have an account you can sign up{" "}
            <Text
              onPress={() => navigation.navigate("signUp")}
              style={styles.createHere}
            >
              Here
            </Text>{" "}
            .
          </Text>
        </View>
        <TouchableOpacity onPress={openUnionLogin} style={styles.changeUnion}>
          <Text style={styles.changeUnion}>Change Union</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 80,
    height: 80,
  },
  modalBack: {
    zIndex: 999,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    height: "110%",
    backgroundColor: "rgba(0, 0, 50, 0.5)",
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
  mainContUnion: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#EAF1F5",
  },
  mainFormUnion: {
    width: "90%",
    alignItems: "center",
    // marginVertical: 80,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#4468c1",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23,
    shadowRadius: 11.27,
    elevation: 10,
  },
  header: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 24,
    margin: 10,
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    height: 56,
    fontSize: 16,
    margin: 10,
    paddingLeft: 24,
  },
  conf: {
    width: "90%",
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
  container: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    fontSize: 16,
    margin: 10,
    paddingLeft: 24,
    borderRadius: 5,
  },
  inputP: {
    height: 56,
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  forgot: {
    width: "100%",
    paddingHorizontal: 14,
    textAlign: "right",
    marginBottom: 20,
    color: "#0A93E1",
  },
  create: {
    width: "65%",
    textAlign: "center",
    margin: 10,
  },
  createHere: {
    color: "#0A93E1",
  },
  changeUnion: {
    marginTop: 35,
    color: "#34519A",
    textTransform: "capitalize",
    fontWeight: "700",
    lineHeight: 19.36,
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
