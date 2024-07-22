import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Linking,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/client";
import Svg, {
  Circle,
  Line,
} from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeaderInPages } from "./../header/HeaderInPages";
import Carousel from "react-native-snap-carousel";
import {
  GET_CATEGORIES,
  GET_COLLECTION_BUSINESS_LIST,
} from "../../../graph/queries/perks";
import moment from "moment-timezone";
import { GET_OFFER_DETAILS } from "../../../graph/queries/gitl";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Perks = () => {
  const [userData, setUserData] = useState(null);
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
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);

  const [searchTxt, setSearchTxt] = useState(""),
    [categories, setCategories] = useState([]),
    [selectedCategory, setSelectedCategory] = useState(null),
    [businesses, setBusinesses] = useState([]);

  const { loading: loading_categories, refetch: getCategories } = useQuery(
    GET_CATEGORIES,
    {
      context: { clientName: "gitl" },
      variables: {
        timezone: moment.tz.guess(),
        limit: 50,
      },
      onCompleted: (data) => {
        if (data && data.collectionFeed && data.collectionFeed.collections) {
          const temp = [];
          for (
            let i = data.collectionFeed.collections.length - 1;
            i >= 0;
            i--
          ) {
            temp.push(data.collectionFeed.collections[i]);
          }
          setCategories(temp);
          setSelectedCategory(temp[0]);
        }
      },
      onError: (err) => {
        console.error(err);
        getCategories();
      },
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
    }
  );

  const { loading, refetch } = useQuery(GET_COLLECTION_BUSINESS_LIST, {
    context: { clientName: "gitl" },
    variables: {
      id: selectedCategory?.id,
      limit: 10,
    },
    onCompleted: (data) => {
      setBusinesses(data.collection.businessFeed.businesses);
      // console.log(data.collection.businessFeed.businesses[0].offers[0].locations);
    },
    onError: (err) => {
      console.error(err);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [getOfferDetails, { error: error_details, loading: loading_details }] =
    useLazyQuery(GET_OFFER_DETAILS, {
      context: { clientName: 'gitl' },

      onCompleted: (data) => {
        if (data && data.offer) {
          console.log(data.offer.redeemUrl);
          Linking.openURL(data.offer.redeemUrl);
        }
      },
      onError: (err) => console.error(err)
    });

  const goToOfferPage = (id) => {
    getOfferDetails({ variables: { id: id } });
  }

  useEffect(() => {
    setBusinesses([]);
    setAfterSearchOffers();
    setSearchTxt("");
    refetch();
  }, [selectedCategory]);

  const [afterSearchOffers, setAfterSearchOffers] = useState([]);
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < businesses.length; i++) {
      businesses[i].offers.forEach((offer) => {
        if (
          offer.headline.toLowerCase().includes(searchTxt.toLowerCase()) ||
          offer.subhead.toLowerCase().includes(searchTxt.toLowerCase())
        ) {
          arr.push(offer);
        }
      });
    }
    setAfterSearchOffers(arr);
  }, [searchTxt]);

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        width: "100%",
        backgroundColor: "#EAF1F5",
      }}>
        <HeaderInPages title="Perks" />
        {categories.length === 0 || loading_details ? (
          <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
          >
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <ScrollView style={{ flex: 1, paddingVertical: 14 }}>
            <View style={{ paddingHorizontal: 14 }}>
              <View style={styles.searchInputWrapper}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  value={searchTxt}
                  onChangeText={setSearchTxt}
                />
                <Svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <Circle
                    cx="7.86436"
                    cy="7.7573"
                    r="6.65"
                    stroke="#34519A"
                    strokeWidth="2"
                  />
                  <Line
                    x1="17.2929"
                    y1="18.5999"
                    x2="13.9074"
                    y2="15.2145"
                    stroke="#34519A"
                    strokeWidth="2"
                  />
                </Svg>
              </View>
            </View>

            <Carousel
              data={categories}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setSelectedCategory(item)}
                  style={
                    item === selectedCategory
                      ? {
                        borderRadius: 21,
                        backgroundColor: "#34519A",
                        justifyContent: "center",
                        alignItems: "center",
                      }
                      : {
                        backgroundColor: "#EDEEF1",
                        borderRadius: 21,
                        justifyContent: "center",
                        alignItems: "center",
                      }
                  }
                >
                  <Text
                    style={
                      item === selectedCategory
                        ? {
                          fontSize: 16,
                          fontWeight: "500",
                          paddingVertical: 16,
                          paddingHorizontal: 24,
                          color: "#fff",
                        }
                        : {
                          paddingVertical: 16,
                          paddingHorizontal: 24,
                          fontSize: 16,
                          fontWeight: "500",
                          color: "#242529",
                        }
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              sliderWidth={screenWidth}
              itemWidth={screenWidth / 2.2}
            // onSnapToItem={index => onTabPress(docTypes[index].id)}
            />

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#D9D9D9",
                marginVertical: 15,
              }}
            ></View>

            <View style={{ paddingHorizontal: 20, paddingVertical: 26 }}>
              {businesses.length === 0 ? (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <ActivityIndicator size="large" color="blue" />
                </View>
              ) : searchTxt.trim().length === 0 ? (
                businesses.map((item) =>
                  item.offers.map((businessesItem) => (
                    <TouchableOpacity onPress={() => goToOfferPage(businessesItem.id)} activeOpacity={0.6} key={businessesItem.id} style={styles.block}>
                      {/* <Text>aaa</Text> */}
                      <Image
                        style={{ width: "24%", height: 86, borderRadius: 10 }}
                        source={{ uri: businessesItem.heroImages[0].url }}
                      />
                      <View style={{ marginLeft: 10, width: "51%" }}>
                        <Text
                          style={{
                            color: "#242529",
                            fontWeight: "600",
                            fontSize: 16,
                            marginBottom: 5,
                            width: "100%",
                          }}
                        >
                          {businessesItem.headline}
                        </Text>
                        <Text
                          style={{
                            color: "#848587",
                            fontWeight: "400",
                            fontSize: 14,
                            width: "65%",
                          }}
                        >
                          {businessesItem.subhead}
                        </Text>
                      </View>
                      <View style={{ width: "23%" }}>
                        {businessesItem.flags.map((flagsItem, idx) => (
                          <Text
                            key={idx + "" + businessesItem.id}
                            style={
                              flagsItem.toLowerCase() === "limited"
                                ? {
                                  textTransform: "capitalize",
                                  width: "100%",
                                  backgroundColor: "#D94D2E",
                                  borderRadius: 10,
                                  color: "#fff",
                                  paddingVertical: 8,
                                  textAlign: "center",
                                  marginBottom: 8,
                                }
                                : flagsItem.toLowerCase() === "exclusive"
                                  ? {
                                    textTransform: "capitalize",
                                    width: "100%",
                                    backgroundColor: "#46e695",
                                    borderRadius: 10,
                                    color: "#fff",
                                    paddingVertical: 8,
                                    textAlign: "center",
                                    marginBottom: 8,
                                  }
                                  : flagsItem.toLowerCase() === "featured"
                                    ? {
                                      textTransform: "capitalize",
                                      width: "100%",
                                      backgroundColor: "#9b59b6",
                                      borderRadius: 10,
                                      color: "#fff",
                                      paddingVertical: 8,
                                      textAlign: "center",
                                      marginBottom: 8,
                                    }
                                    : {
                                      textTransform: "capitalize",
                                      width: "100%",
                                      backgroundColor: "#f1c40f",
                                      borderRadius: 10,
                                      color: "#fff",
                                      paddingVertical: 8,
                                      textAlign: "center",
                                      marginBottom: 8,
                                    }
                            }
                          >
                            {flagsItem}
                          </Text>
                        ))}
                      </View>
                    </TouchableOpacity>
                  ))
                )
              ) : (
                afterSearchOffers?.map((businessesItem) => (
                  <TouchableOpacity onPress={() => goToOfferPage(businessesItem.id)} activeOpacity={0.6} key={businessesItem.id} style={styles.block}>
                    {/* <Text>aaa</Text> */}
                    <Image
                      style={{ width: "24%", height: 86, borderRadius: 10 }}
                      source={{ uri: businessesItem.heroImages[0].url }}
                    />
                    <View style={{ marginLeft: 10, width: "51%" }}>
                      <Text
                        style={{
                          color: "#242529",
                          fontWeight: "600",
                          fontSize: 16,
                          marginBottom: 5,
                          width: "100%",
                        }}
                      >
                        {businessesItem.headline}
                      </Text>
                      <Text
                        style={{
                          color: "#848587",
                          fontWeight: "400",
                          fontSize: 14,
                          width: "65%",
                        }}
                      >
                        {businessesItem.subhead}
                      </Text>
                    </View>
                    <View style={{ width: "23%" }}>
                      {businessesItem.flags.map((flagsItem, idx) => (
                        <Text
                          key={idx + "" + businessesItem.id}
                          style={
                            flagsItem.toLowerCase() === "limited"
                              ? {
                                textTransform: "capitalize",
                                width: "100%",
                                backgroundColor: "#D94D2E",
                                borderRadius: 10,
                                color: "#fff",
                                paddingVertical: 8,
                                textAlign: "center",
                                marginBottom: 8,
                              }
                              : flagsItem.toLowerCase() === "exclusive"
                                ? {
                                  textTransform: "capitalize",
                                  width: "100%",
                                  backgroundColor: "#46e695",
                                  borderRadius: 10,
                                  color: "#fff",
                                  paddingVertical: 8,
                                  textAlign: "center",
                                  marginBottom: 8,
                                }
                                : flagsItem.toLowerCase() === "featured"
                                  ? {
                                    textTransform: "capitalize",
                                    width: "100%",
                                    backgroundColor: "#9b59b6",
                                    borderRadius: 10,
                                    color: "#fff",
                                    paddingVertical: 8,
                                    textAlign: "center",
                                    marginBottom: 8,
                                  }
                                  : {
                                    textTransform: "capitalize",
                                    width: "100%",
                                    backgroundColor: "#f1c40f",
                                    borderRadius: 10,
                                    color: "#fff",
                                    paddingVertical: 8,
                                    textAlign: "center",
                                    marginBottom: 8,
                                  }
                          }
                        >
                          {flagsItem}
                        </Text>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    flex: 1,
  },
  searchInput: {
    height: "100%",
    width: "85%",
    paddingVertical: 16,
    fontSize: 16,
    color: "#A8A8AA",
    fontWeight: "500",
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#4468C1", // Shadow color
    shadowOffset: {
      width: 0,
      height: 2, // Shadow height
    },
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5,

    paddingHorizontal: 24,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },

  block: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#4468C1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 5,
  },
  rows: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
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
    width: "90%",
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
  conf: {
    width: "100%",
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
});
