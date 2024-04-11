import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useMutation, useQuery } from '@apollo/client';

import AnimatedLoader from 'react-native-animated-loader';

import PhoneInput from "react-native-phone-number-input";
import { DatePicker } from "react-native-woodpicker";
import { useUnionState } from '../../../store/union-context';
import { REGISTER_MEMBER } from "../../../graph/mutations/users";

export const SignUp = ({ navigation }) => {


  const handleText = (text) =>
    pickedDate ? (
      pickedDate.toDateString()
    ) : (
      <Text style={{ color: "#878C9C" }}>Date of birth</Text>
    );

  const unionState = useUnionState();
  let logoURL = '';
  if (unionState != null) {
    logoURL = unionState.information.imageURL
      ? { uri: `${unionState.information.imageURL}` }
      : require('../../../ios-icon.png');
  }


  const [memberRegistration, { loading: loadingMemberRegister }] = useMutation(
    REGISTER_MEMBER,
    {
      onCompleted: () => {
        console.log('ok');
        setVisible(false);
      },
      onError: (err) => {
        console.error(err); // eslint-disable-line
        if (err.message.includes('Failed to register new user. User with Cell Phone')) {

          setErrMsg(<>Error. An account with this cell phone number {formattedValue} already exists. Please
            {' '}<Text onPress={() => { navigation.navigate("login"); setErrUser(false); }} style={{ textDecorationLine: 'underline' }}>
              Login
            </Text>{' '}
            .</>);
          setTip('');
          setVisible(false);
          setErrUser(true);
        }

        if (err.message.includes('Failed to register new user. User with email')) {

          setErrMsg(<>
            Error. An account with this personal email {email} already exists. Please
            {' '}<Text onPress={() => { navigation.navigate("login"); setErrUser(false); }} style={{ textDecorationLine: 'underline' }}>
              Login
            </Text>{' '}
            .</>);
          setTip('');
          setVisible(false);
          setErrUser(true);
        }



        if (err.message.includes('cannot be empty') || err.message.includes('parsing time')) {
          setErrMsg(`Error. You must provide all the required information.`);
          setTip('');
          setVisible(false);
          setErrUser(true);
        }
      }
    }
  );

  const [email, setEmail] = useState('');
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState('');
  const [pickedDate, setPickedDate] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const [emailBorder, setEmailBorder] = useState('');
  const [formattedValueBorder, setFormattedValueBorder] = useState('');
  const [pickedDateBorder, setPickedDateBorder] = useState('');
  const [nameBorder, setNameBorder] = useState('');
  const [lastNameBorder, setLastNameBorder] = useState('');
  const [passwordBorder, setPasswordBorder] = useState('');
  const [confirmPasswordBorder, setConfirmPasswordBorder] = useState('');

  const registration = () => {
    const memberData = {}, memberProfile = {};
    setVisible(true);
    if (email.trim().length !== 0) {
      setEmailBorder({ borderColor: 'green' })
    } else {
      setEmailBorder({ borderColor: 'red' })
    }

    if (name.trim().length !== 0) {
      setNameBorder({ borderColor: 'green' })
    } else {
      setNameBorder({ borderColor: 'red' })
    }

    if (lastName.trim().length !== 0) {
      setLastNameBorder({ borderColor: 'green' })
    } else {
      setLastNameBorder({ borderColor: 'red' })
    }

    if (password.trim().length !== 0 && confirmPassword.trim().length !== 0 && password.trim() === confirmPassword.trim()) {
      setPasswordBorder({ borderColor: 'green' })
    } else {
      setPasswordBorder({ borderColor: 'red' })
    }

    if (pickedDate !== '') {
      setPickedDateBorder({ borderColor: 'green' })
    } else {
      setPickedDateBorder({ borderColor: 'red' })
    }

    if (value.trim().length !== 0) {
      setFormattedValueBorder({ borderColor: 'green' })
    } else {
      setFormattedValueBorder({ borderColor: 'red' })
    }




    memberData.dateOfBirth = pickedDate;
    memberData.firstName = name.trim();
    memberData.lastName = lastName.trim();
    memberData.password = password.trim();

    memberProfile.email = email.trim();
    memberProfile.mobile = formattedValue;

    if (password.trim() === confirmPassword.trim()) {
      memberRegistration({
        variables: {
          unionID: unionState.id,
          input: {
            ...memberData,
            profile: memberProfile
          } // fire the mutation with the filtered/ final member info
        }
      });
    } else {
      setErrMsg('Password and confirm password do not match.')
      setErrUser(true);
      setVisible(false);
      setTip('');
    }
  }

  const [errUser, setErrUser] = useState(false);
  const [errMsg, setErrMsg] = useState(''), [tip, setTip] = useState('');
  const [visible, setVisible] = useState(false);

  return (
    <ScrollView style={styles.backCont}>
       <AnimatedLoader
          visible={visible}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={styles.lottie}
          speed={1}
          source={require("../../../Animation.json")}>
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
      <View style={styles.mainContUnion}>
        <View>
          <Image
            style={{ width: 100, height: 100, borderRadius: 20 }}
            source={logoURL}
          />
        </View>
        <View style={styles.mainFormUnion}>
          <Text style={styles.header}>
            Sign up to join your Union community
          </Text>
          <TextInput
            onChangeText={setEmail}
            style={{ ...styles.input, ...emailBorder }}
            placeholder="Personal Email"
            keyboardType="email-address"
          />
          <TextInput onChangeText={setName} style={{ ...styles.input, ...nameBorder }} placeholder="First Name" />
          <TextInput onChangeText={setLastName} style={{ ...styles.input, ...lastNameBorder }} placeholder="Last Name" />
          <TextInput
            onChangeText={setPassword}
            style={{ ...styles.input, ...passwordBorder }}
            placeholder="Password"
            secureTextEntry={true}
          />
          <TextInput
            onChangeText={setConfirmPassword}
            style={{ ...styles.input, ...passwordBorder }}
            placeholder="Repeat password"
            secureTextEntry={true}
          />

          <View style={{ ...styles.phone, ...formattedValueBorder }}>
            <PhoneInput
              placeholder="Cell phone"
              containerStyle={{ backgroundColor: "#fff" }}
              flagButtonStyle={{ width: '20%' }}
              textContainerStyle={{ backgroundColor: "#fff" }}
              defaultValue={value}
              defaultCode="CA"
              layout="first"
              onChangeText={(text) => {
                setValue(text);
              }}
              onChangeFormattedText={(text) => {
                //   console.log(text);
                setFormattedValue(text);
              }}
              withDarkTheme={false}
              withShadow
              autoFocus={false}
            />
          </View>

          <DatePicker
            style={{ ...styles.dateP, ...pickedDateBorder }}
            value={pickedDate}
            onDateChange={setPickedDate}
            title="Date Picker"
            text={handleText()}
            isNullable={false}
            iosDisplay="inline"
          //backdropAnimation={{ opacity: 0 }}
          //minimumDate={new Date(Date.now())}
          //maximumDate={new Date(Date.now()+2000000000)}
          //iosMode="date"
          //androidMode="countdown"
          //iosDisplay="spinner"
          //androidDisplay="spinner"
          //locale="fr"
          />
          <View style={styles.btns}>
            <TouchableOpacity onPress={() => navigation.navigate('login')} activeOpacity={0.7} style={styles.conf1}>
              <Text style={styles.btnConf1}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={registration} activeOpacity={0.7} style={styles.conf2}>
              <Text style={styles.btnConf2}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '22px',
  },
  tip: {
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '22px',
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

  btns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    margin: 10,
  },
  dateP: {
    width: "90%",
    paddingLeft: 24,
    height: 56,
    borderWidth: "1px",
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    margin: 10,
  },
  phone: {
    width: "90%",
    overflow: "hidden",
    borderWidth: "1px",
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    margin: 10,
  },
  backCont: {
    paddingVertical: 45,
    flex: 1,
    backgroundColor: "#EAF1F5",
  },
  mainContUnion: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
    borderWidth: "1px",
    borderColor: "#BFC2CD",
    borderStyle: "solid",
    height: 56,
    fontSize: 16,
    margin: 10,
    paddingLeft: 24,
  },
  conf1: {
    width: "45%",
    height: 56,
    borderColor: "#34519A",
    borderWidth: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  conf2: {
    width: "45%",
    borderStyle: "solid",
    borderColor: "#34519A",
    borderWidth: 1,
    backgroundColor: "#34519A",
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnConf1: {
    color: "#34519A",
    fontWeight: "700",
    fontSize: 16,
  },
  btnConf2: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
