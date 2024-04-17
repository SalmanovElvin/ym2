import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useMutation } from '@apollo/client';
import { useUnionState } from '../../../store/union-context';
import { REQUEST_PASSWORD_RESET } from '../../../graph/mutations/password';

import AnimatedLoader from 'react-native-animated-loader';

export const EnterEmail = ({ navigation }) => {

  const [unionState, setUnionState] = useState(useUnionState());
  const [email, setEmail] = useState('');

  const [logoURL, setLogoURL] = useState("");


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
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);



  let timeRedirecting = 7;

  //----------------------------------------------------------------------------Request Mutation
  const [sendRequest, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    variables: {
      unionID: unionState.id,
      username: email
    },
    onCompleted: () => {
      setSuccess(true);
      setTimeout(function () {
        setSuccess(false);
        navigation.navigate('login');
      }, 7000);

      const interval = setInterval(() => {
        timeRedirecting--;
        setTime(timeRedirecting);

        if (timeRedirecting === 0) {
          clearInterval(interval);
          console.log("Interval stopped.");
        }
      }, 1000);
      setVisible(false);
    },

    onError: (err) => {
      console.error(err); // eslint-disable-line
      if (err.message.includes('username does not exist')) {

        setErrMsg(<>Account with this username/email does not exist. If you are a new member, please click on
          {' '}<Text onPress={() => { navigation.navigate("signUp"); setErrUser(false); }} style={{ textDecorationLine: 'underline' }}>
            Register
          </Text>{' '}.
        </>);
        setTip('Hint: you can also use the personal email associated with your account to reset your password.');
        setErrUser(true);
        setVisible(false);
      }
    }
  });
  //----------------------------------------------------------------------------- Password Reset Function
  const passwordReset = (e) => {
    setVisible(true);
    Keyboard.dismiss();
    e.preventDefault();
    if (email.trim().length !== 0) {
      sendRequest();
    } else {
      setErrUser(true);
      setErrMsg('Please provide your email address.');
      setTip('');
      setVisible(false);
    }
  };

  const [errUser, setErrUser] = useState(false);
  const [errMsg, setErrMsg] = useState(''), [tip, setTip] = useState('');
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [time, setTime] = useState(7);

  return (
    <View style={styles.mainContUnion}>
      <AnimatedLoader
        visible={visible}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={styles.lottie}
        speed={1}
        source={require("../../../animations/Animation.json")}>
      </AnimatedLoader>

      <AnimatedLoader
        visible={success}
        overlayColor="rgba(255,255,255,0.9)"
        animationStyle={styles.lottie}
        speed={1}
        source={require("../../../animations/success.json")}>
        <Text style={styles.ok}>
          The password reset request operation was successful.
        </Text>
        <Text style={styles.ok2}>
          We will send you a link to reset your password to the email you entered.
        </Text>
        <Text style={styles.ok2}>
          You will be redirected to the login page in {time} seconds.
        </Text>
      </AnimatedLoader>

      {errUser ?
        <View style={styles.modalBack}>
          <View style={styles.modal}>
            <Text style={styles.errMsg}>
              {errMsg}
            </Text>
            <Text style={styles.tip}>
              {tip}
            </Text>
            <TouchableOpacity onPress={() => setErrUser(false)} activeOpacity={0.7} style={styles.conf}>
              <Text style={styles.btnConf}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        :
        <></>
      }

      <View>
        <Image
          style={{ width: 100, height: 100, borderRadius: 20 }}
          source={logoURL}
        />
      </View>
      <View style={styles.mainFormUnion}>
        <Text style={styles.header}>Enter your Email</Text>

        <TextInput
          style={styles.input}
          placeholder="Personal Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <TouchableOpacity onPress={passwordReset} activeOpacity={0.7} style={styles.conf}>
          <Text style={styles.btnConf}>Request password reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ok: {
    padding: 15,
    fontSize: 16,
    color: 'green',
    width: '70%',
    textAlign: 'center',
  },
  ok2: {
    padding: 5,
    fontSize: 16,
    color: 'green',
    width: '70%',
    textAlign: 'center',
  },
  lottie: {
    width: 80,
    height: 80,
  },
  modalBack: {
    zIndex: 999,
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 50, 0.5)',
    height: '100%',
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
  btnConf: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16

  },
  mainContUnion: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#EAF1F5",
  },
  mainFormUnion: {
    width: "80%",
    alignItems: "center",
    margin: 45,
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
    margin: 10,
    borderRadius: 5,
  },
  btnConf: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
