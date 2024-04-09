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

import PhoneInput from "react-native-phone-number-input";
import { DatePicker } from "react-native-woodpicker";
import { useUnionState } from '../../../store/union-context';

export const SignUp = ({ navigation }) => {
  const [value, setValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const [pickedDate, setPickedDate] = useState("");

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
  return (
    <ScrollView style={styles.backCont}>
      <View style={styles.mainContUnion}>
        <View>
          <Image
            style={{ width: 100, height: 100 }}
            source={logoURL}
          />
        </View>
        <View style={styles.mainFormUnion}>
          <Text style={styles.header}>
            Sign up to join your Union community
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Personal Email"
            keyboardType="email-address"
          />
          <TextInput style={styles.input} placeholder="First Name" />
          <TextInput style={styles.input} placeholder="Last Name" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="Repeat password"
            secureTextEntry={true}
          />

          <View style={styles.phone}>
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
            style={styles.dateP}
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
            <TouchableOpacity activeOpacity={0.7} style={styles.conf2}>
              <Text style={styles.btnConf2}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
