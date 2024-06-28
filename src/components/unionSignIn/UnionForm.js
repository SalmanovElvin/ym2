import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity, Keyboard, ScrollView, Modal, SafeAreaView } from "react-native";
import Svg, { G, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { useLazyQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GET_UNION, GET_UNION_BY_NAME } from '../../../graph/queries/unions';
import { useMutation, useQuery } from '@apollo/client';
import { useUserDispatch } from '../../../store/user-context';
import { useUnionState, useUnionDispatch } from '../../../store/union-context';
import LottieView from 'lottie-react-native';

export const UnionForm = ({ navigation }) => {
  const openLogin = (e) => {
    getUnion(e);
  };


  const userDispatch = useUserDispatch();
  const unionDispatch = useUnionDispatch();
  const union = useUnionState();

  const [unionIN, setUnionIN] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('UNION'); // Replace 'key' with your actual key
        if (value !== null) {
          setUnionIN(true);
          navigation.navigate('login');
          // console.log('Retrieved data:', JSON.parse(value).information.imageURL);
        } else {
          console.log('No data found');
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    }
    getData();
  }, [])

  const [getUnionByName, { loading, error }] = useLazyQuery(GET_UNION_BY_NAME, {
    onCompleted: (data) => {
      setVisible(false);
      unionDispatch({ type: 'ASSIGN', payload: data.unionByName });
      // console.log(data.unionByName);
      navigation.navigate("login");

    },
    onError: (error) => {
      setVisible(false);
      Keyboard.dismiss();
      setErrMsg(`Union and or Local not found. Please enter your Union Name and your Local Number. If your Union does not have a Local, you can leave the field blank.`);
      setTip('Tip: You can do a quick web search or ask your Union Representative for this information.');
      setErrUnion(true);
      // console.error(error);
    }
  });

  const getUnion = (e) => {
    e.preventDefault();
    // console.log(unionVal.trim()+' '+localNumber.trim());
    if (unionVal.trim().length !== 0) {
      setVisible(true);
      getUnionByName({ variables: { name: unionVal.trim() + ' ' + localNumber.trim() } });
      Keyboard.dismiss();
    } else {
      setErrMsg(`Please fill in the union and local number fields.`);
      setTip('');
      setErrUnion(true);
      Keyboard.dismiss();
      // alert('Please, write union.');
    }
  };



  // // Define the key
  // const UNION_KEY = 'UNION';

  // // Function to get item from AsyncStorage with UNION key
  // const getUnionItem = async () => {
  //   try {
  //     // Retrieve item from AsyncStorage
  //     const item = await AsyncStorage.getItem(UNION_KEY);

  //     // Check if item exists
  //     if (item !== null) {
  //       // Item found, do something with it
  //       console.log('Item found:', item.id);
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

  const [unionVal, setUnion] = useState('');
  const [localNumber, setLocalNumber] = useState('');

  const getUnionValue = (text) => {
    setUnion(text);
    // console.log(text);
  }
  const getLNValue = (text) => {
    setLocalNumber(text);
    // console.log(text);
  }


  const [visible, setVisible] = useState(false);
  const [errUnion, setErrUnion] = useState(false);
  const [errMsg, setErrMsg] = useState(''), [tip, setTip] = useState('');

  return (
    <SafeAreaView style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#EAF1F5",
    }}>
      <View style={styles.mainContUnion}>
        {errUnion ?
          <View style={styles.modalBack}>
            <View style={styles.modal}>
              <Text style={styles.errMsg}>
                {errMsg}
              </Text>
              <Text style={styles.tip}>
                {tip}
              </Text>
              <TouchableOpacity onPress={() => setErrUnion(false)} activeOpacity={0.7} style={styles.conf}>
                <Text style={styles.btnConf}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
          :
          <></>
        }
        <View>
          <Svg
            width="163"
            height="23"
            viewBox="0 0 163 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M0.333069 0.310181L9.06142 12.9945V22.4507H15.8846V12.9945L24.575 0.310181H16.8973L12.454 7.98784L7.96642 0.310181H0.333069Z"
              fill="#3A3C42"
            />
            <Path
              d="M34.3096 6.10352e-05C27.6447 6.10352e-05 22.714 3.79775 22.714 11.2159C22.714 18.6341 26.7142 22.7862 34.3096 22.7862C41.905 22.7862 45.5444 18.7733 45.5444 10.7602C45.5444 2.74706 39.5757 6.10352e-05 34.3096 6.10352e-05ZM34.202 17.7226C31.0373 17.7226 29.3789 15.3934 29.3789 11.2729C29.3789 7.15237 31.4297 5.06365 34.202 5.06365C36.3857 5.06365 38.8732 6.60804 38.8732 11.0703C38.8732 15.5326 37.3604 17.7226 34.202 17.7226Z"
              fill="#3A3C42"
            />
            <Path
              d="M47.2785 0.310181V12.9691C47.2785 18.4505 49.8672 22.7862 57.931 22.7862C65.9947 22.7862 67.1024 18.5328 67.1024 18.5328L61.4059 15.1781C61.4059 15.1781 60.5324 17.7226 57.931 17.7226C55.3296 17.7226 54.1333 16.6339 54.1333 12.9945V0.310181H47.2785Z"
              fill="#3A3C42"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M141.361 17.3806V22.286H122.613V0.069519H140.949V4.97487H129.48V8.38013H140.196V12.9563H129.48V17.3806H141.361ZM68.559 14.6907C68.5676 15.6192 68.3504 16.5359 67.9261 17.3618L62.065 13.9628V0.310158H68.8122L77.1355 12.7159V0.310158H83.8827V22.533H77.5532L68.559 9.92464C68.559 9.92464 68.597 12.9944 68.559 14.6907ZM86.3067 0.310158H93.1742V22.533H86.3067V0.310158ZM120.752 0.310158H113.885V22.533H120.752V0.310158ZM102.548 8.93091V5.12056H112.65V0.310158H95.6804V22.533H102.548V13.4818H111.156V8.93091H102.548ZM142.543 0.069519H152.481C160.943 0.069519 163 5.69643 163 10.8296C163 17.5895 160.367 22.286 152.772 22.286H142.543V0.069519ZM149.329 17.3996H151.17C152.702 17.3996 156.259 16.8933 156.259 12.3107C156.259 7.2155 155.025 5.06348 151.392 5.06348H149.329V17.3996Z"
              fill="url(#paint0_linear_125_2557)"
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_125_2557"
                x1="163.475"
                y1="11.393"
                x2="61.887"
                y2="11.393"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="#34519A" />
                <Stop offset="1" stopColor="#5884F0" />
              </LinearGradient>
            </Defs>
          </Svg>
        </View>
        <View style={styles.mainFormUnion}>
          <Text style={styles.header}>Find My Union Local</Text>
          <TextInput onChangeText={getUnionValue} value={unionVal} style={styles.input} placeholder="Union" />
          <TextInput onChangeText={getLNValue} value={localNumber} style={styles.input} placeholder="Local number" />
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
          <TouchableOpacity onPress={(e) => openLogin(e)} activeOpacity={0.7} style={styles.conf}>
            <Text style={styles.btnConf}>Continue</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 5,
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
