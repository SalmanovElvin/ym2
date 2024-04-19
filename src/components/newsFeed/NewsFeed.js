import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import Svg, {
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
  Rect,
  Ellipse,
} from "react-native-svg";
import { LIKE_NEWS_ITEM, PIN_NEWS, SHOW_PIN } from "../../../graph/mutations/news";
import HTMLView from "react-native-htmlview";
import AnimatedLoader from "react-native-animated-loader";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NewsFeed = ({ navigation, news, getNews }) => {
  // console.log(news.likes);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapsible = () => {
    setIsCollapsed(!isCollapsed);
  };

  // First date: March 2, 2021, at 17:25:02 UTC
  const firstDate = new Date(news?.createdOn);

  // Current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const difference = currentDate.getTime() - firstDate.getTime();

  // Convert milliseconds to seconds, minutes, hours, weeks, months, and years
  const secondsDifference = Math.floor(difference / 1000);
  const minutesDifference = Math.floor(difference / (1000 * 60));
  const hoursDifference = Math.floor(difference / (1000 * 60 * 60));
  const weeksDifference = Math.floor(difference / (1000 * 60 * 60 * 24 * 7));
  const monthsDifference = Math.floor(
    currentDate.getMonth() -
    firstDate.getMonth() +
    12 * (currentDate.getFullYear() - firstDate.getFullYear())
  );
  const yearsDifference = Math.floor(
    currentDate.getFullYear() - firstDate.getFullYear()
  );
  const [postedTime, setPostedTime] = useState("");

  useEffect(() => {
    if (yearsDifference !== 0) {
      if (yearsDifference === 1) {
        setPostedTime(`${yearsDifference} year`);
      } else {
        setPostedTime(`${yearsDifference} years`);
      }
    } else {
      if (monthsDifference !== 0) {
        if (monthsDifference === 1) {
          setPostedTime(`${monthsDifference} month`);
        } else {
          setPostedTime(`${monthsDifference} months`);
        }
      } else {
        if (weeksDifference !== 0) {
          if (weeksDifference === 1) {
            setPostedTime(`${weeksDifference} week`);
          } else {
            setPostedTime(`${weeksDifference} weeks`);
          }
        } else {
          if (hoursDifference !== 0) {
            if (hoursDifference === 1) {
              setPostedTime(`${hoursDifference} hour`);
            } else {
              setPostedTime(`${hoursDifference} hours`);
            }
          } else {
            if (minutesDifference !== 0) {
              if (minutesDifference === 1) {
                setPostedTime(`${minutesDifference} minute`);
              } else {
                setPostedTime(`${minutesDifference} minute`);
              }
            } else {
              if (secondsDifference !== 0) {
                if (secondsDifference === 1) {
                  setPostedTime(`${secondsDifference} second`);
                } else {
                  setPostedTime(`${secondsDifference} seconds`);
                }
              }
            }
          }
        }
      }
    }
  }, []);

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
          //   console.log(news.likes);
          for (let i = 0; i < news?.likes?.length; i++) {
            if (news.likes[i] == JSON.parse(userVal).id) {
              setIsLiked(true);
            }
          }
          //   setTimeout(() => {

          //   }, 200);
        } else {
          console.log("No user data found");
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };
    getData();
  }, []);

  const [likeNewsItem] = useMutation(LIKE_NEWS_ITEM, {
    variables: {
      unionID: userData?.unionID,
      newsID: news?.id,
      userID: userData?.id,
    },
    onCompleted: () => {
      console.log("liked");
    },
    onError: (err) => {
      console.log(err);
    },
    notifyOnNetworkStatusChange: true,
  });

  const [pinNews] = useMutation(PIN_NEWS, {
    variables: {
      unionID: userData?.unionID,
      newsID: news?.id
    },
    onError: (err) => {
      console.log(err);
    },
    onCompleted: () => {
      console.log('pinned or unpinned');
    }
  });

  const [showPin] = useMutation(SHOW_PIN, {
    onError: (err) => {
      console.log(err);
    },
    onCompleted: () => {
      console.log('unpinned');
    }
  });


  const pinCard = () => {
    // if (news?.pinned === true) {
    // showPin({
    //   variables: {
    //     unionID: userData.unionID,
    //     newsID: news.id,
    //     show: false
    //   }
    // });
    // getNews();
    // } else {
    pinNews();
    getNews();
    // }
  };

  const [isLiked, setIsLiked] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false);
  const lastPressRef = useRef(0);

  const handleDoublePress = () => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastPressRef.current;

    const DOUBLE_PRESS_DELAY = 300; // Adjust the delay as needed (in milliseconds)

    if (delta < DOUBLE_PRESS_DELAY) {
      // Double click detected
      if (isLiked === false) {
        likeHandler();
        likeNewsItem();
        setLikeCount(likeCount + 1);
      }
      if (likeVisible === false) {
        setLikeVisible(true);
        setTimeout(() => {
          animationRef.current.play();
        }, 100);
        setTimeout(() => {
          setLikeVisible(false);
        }, 1000);
      }
    }

    lastPressRef.current = currentTime;
  };
  //   {isLiked ? +news?.likes?.length + 1 : news?.likes?.length}
  const [likeCount, setLikeCount] = useState(news.likes?.length);
  const likeHandler = () => {
    if (isLiked == false) {
      likeNewsItem();
      setLikeCount(likeCount + 1);
    }
    //else {
    //setLikeCount(likeCount - 1);
    //}
    // setIsLiked(!isLiked);
    setIsLiked(true);


  };

  const animationRef = useRef();
  return (
    <View style={styles.wrapper}>
      <View style={styles.feedHeader}>
        <View style={styles.photo}>
          {news?.creator?.profile?.imageURL !== "" ? (
            <Image
              style={{ width: 40, height: 40, borderRadius: 50 }}
              source={{ uri: news?.creator?.profile?.imageURL }}
            />
          ) : (
            <Svg
              style={{ width: 30, height: 30, borderRadius: 50 }}
              viewBox="0 0 1024 1024"
              class="icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M691.573 338.89c-1.282 109.275-89.055 197.047-198.33 198.331-109.292 1.282-197.065-90.984-198.325-198.331-0.809-68.918-107.758-68.998-106.948 0 1.968 167.591 137.681 303.31 305.272 305.278C660.85 646.136 796.587 503.52 798.521 338.89c0.811-68.998-106.136-68.918-106.948 0z"
                fill="#4A5699"
              />
              <Path
                d="M294.918 325.158c1.283-109.272 89.051-197.047 198.325-198.33 109.292-1.283 197.068 90.983 198.33 198.33 0.812 68.919 107.759 68.998 106.948 0C796.555 157.567 660.839 21.842 493.243 19.88c-167.604-1.963-303.341 140.65-305.272 305.278-0.811 68.998 106.139 68.919 106.947 0z"
                fill="#C45FA0"
              />
              <Path
                d="M222.324 959.994c0.65-74.688 29.145-144.534 80.868-197.979 53.219-54.995 126.117-84.134 201.904-84.794 74.199-0.646 145.202 29.791 197.979 80.867 54.995 53.219 84.13 126.119 84.79 201.905 0.603 68.932 107.549 68.99 106.947 0-1.857-213.527-176.184-387.865-389.716-389.721-213.551-1.854-387.885 178.986-389.721 389.721-0.601 68.991 106.349 68.933 106.949 0.001z"
                fill="#E5594F"
              />
            </Svg>
          )}

          <View style={styles.nameWrapper}>
            <Text style={styles.name}>
              {news?.creator?.firstName} {news?.creator?.lastName}
            </Text>
            <Text style={styles.postedTime}>posted {postedTime} ago</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={pinCard}
            style={{
              height: 20,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="blue"
              xmlns="http://www.w3.org/2000/svg"
            >
              <Path
                d="M11.4917 0.545482L15.4545 4.50825C15.6667 4.72049 15.8244 4.98082 15.9144 5.26712C16.0043 5.55342 16.0237 5.8572 15.9711 6.15263C15.9184 6.44806 15.7951 6.72639 15.6117 6.96394C15.4284 7.2015 15.1904 7.39125 14.9179 7.51706L13.5051 8.16971C13.0542 8.37829 12.6565 8.68628 12.3417 9.07057C12.027 9.45485 11.8034 9.90545 11.6877 10.3885L11.0659 13.0013C10.7284 14.4194 8.96631 14.9177 7.93569 13.8871L5.58912 11.5405L1.3623 15.7663C1.2882 15.8404 1.20023 15.8991 1.10341 15.9393C1.00659 15.9794 0.902816 16 0.798019 16C0.693222 16 0.589451 15.9794 0.49263 15.9393C0.39581 15.8991 0.307837 15.8404 0.233734 15.7663C0.159631 15.6922 0.10085 15.6042 0.0607456 15.5074C0.0206414 15.4105 0 15.3068 0 15.202C0 15.0972 0.0206414 14.9934 0.0607456 14.8966C0.10085 14.7998 0.159631 14.7118 0.233734 14.6377L4.45948 10.4109L2.11291 8.06431C1.08229 7.03369 1.58056 5.27163 2.99873 4.93413L5.61147 4.31235C6.09483 4.1973 6.54573 3.97392 6.93011 3.65908C7.31449 3.34423 7.6223 2.94616 7.83028 2.49493L8.48294 1.08209C8.60875 0.809641 8.7985 0.571615 9.03606 0.388256C9.27361 0.204897 9.55194 0.0816304 9.84737 0.0289426C10.1428 -0.0237452 10.4466 -0.00429532 10.7329 0.0856376C11.0192 0.175571 11.2795 0.333325 11.4917 0.545482ZM6.15659 9.84979L9.06532 12.7575C9.09882 12.7909 9.14064 12.8149 9.18648 12.8268C9.23232 12.8388 9.28051 12.8382 9.32609 12.8253C9.37166 12.8124 9.41296 12.7876 9.44573 12.7534C9.4785 12.7192 9.50154 12.6768 9.51249 12.6308L10.1343 10.018C10.3058 9.29976 10.638 8.62975 11.1058 8.05843C11.5737 7.48711 12.165 7.02935 12.8354 6.71961L14.2493 6.06696C14.2883 6.049 14.3223 6.02188 14.3486 5.98792C14.3748 5.95396 14.3924 5.91416 14.4 5.87191C14.4075 5.82966 14.4047 5.78622 14.3918 5.74528C14.3789 5.70435 14.3563 5.66714 14.3259 5.63682L10.3632 1.67405C10.3329 1.64368 10.2956 1.62109 10.2547 1.6082C10.2138 1.59531 10.1703 1.59252 10.1281 1.60005C10.0858 1.60758 10.046 1.62521 10.0121 1.65144C9.97812 1.67768 9.951 1.71173 9.93304 1.75071L9.28039 3.16462C8.97078 3.83505 8.51306 4.42649 7.94172 4.89437C7.37037 5.36225 6.70031 5.69438 5.98199 5.86573L3.36924 6.48751C3.32316 6.49846 3.28083 6.5215 3.24663 6.55427C3.21242 6.58704 3.18758 6.62834 3.17467 6.67391C3.16176 6.71949 3.16124 6.76768 3.17317 6.81352C3.1851 6.85936 3.20905 6.90118 3.24254 6.93468L6.15021 9.8434L6.15659 9.84979Z"
                fill={news?.pinned === true ? "blue" : "#58595E"}
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 20,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={toggleCollapsible}
          >
            {isCollapsed ? (
              <Svg
                width="17"
                height="10"
                viewBox="0 0 17 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M1 1L8.5 8.5L16 1"
                  stroke="#4B598E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            ) : (
              <Svg
                width="17"
                height="11"
                viewBox="0 0 17 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M16 9.25L8.5 1.75L1 9.25"
                  stroke="#4B598E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
          </TouchableOpacity>
        </View>
      </View>
      {isCollapsed && (
        <Text style={styles.descriptionTxt}>
          {news.content.length < 75 ? (
            <HTMLView value={news?.content} />
          ) : (
            <>
              <HTMLView
                value={news.content.slice(0, 75) + "..."}
                stylesheet={styles}
              />
            </>
          )}
        </Text>
      )}

      {!isCollapsed && (
        <>
          <Text style={styles.descriptionTxt}>
            <HTMLView value={news?.content} />
          </Text>
          {news?.images !== null && news?.images?.length !== 0 ? (
            <TouchableOpacity
              style={{
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleDoublePress}
              activeOpacity={0.8}
            >
              {likeVisible ? (
                <LottieView
                  ref={animationRef}
                  source={require("../../../animations/like.json")} // Replace with your animation file
                  style={{
                    width: 170,
                    height: 170,
                    position: "absolute",
                    zIndex: 999,
                  }}
                  loop={false} // Set loop to false to play the animation only once
                />
              ) : (
                <></>
              )}

              <Image
                style={{ width: "100%", height: 244, borderRadius: 5 }}
                source={{ uri: news?.images[0] }}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </>
      )}
      <View style={styles.iconsWrapper}>
        <View style={styles.bottomIconWrapper}>
          <Svg
            onPress={() => likeHandler()}
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill={isLiked ? "red" : "none"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M6.5 1.5C3.4625 1.5 1 4.08259 1 7.26822C1 13.0364 7.5 18.2803 11 19.5C14.5 18.2803 21 13.0364 21 7.26822C21 4.08259 18.5375 1.5 15.5 1.5C13.64 1.5 11.995 2.46854 11 3.95097C10.4928 3.19334 9.81908 2.57503 9.03577 2.14839C8.25245 1.72175 7.38265 1.49935 6.5 1.5Z"
              stroke={isLiked ? "red" : "#242529"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.count}>{likeCount}</Text>
        </View>
        <View style={styles.bottomIconWrapper}>
          <Svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M10 19.5C11.78 19.5 13.5201 18.9722 15.0001 17.9832C16.4802 16.9943 17.6337 15.5887 18.3149 13.9442C18.9961 12.2996 19.1743 10.49 18.8271 8.74419C18.4798 6.99836 17.6226 5.39472 16.364 4.13604C15.1053 2.87737 13.5016 2.0202 11.7558 1.67294C10.01 1.32567 8.20038 1.5039 6.55585 2.18509C4.91131 2.86628 3.50571 4.01983 2.51677 5.49987C1.52784 6.97991 1 8.71997 1 10.5C1 11.988 1.36 13.391 2 14.627L1 19.5L5.873 18.5C7.109 19.14 8.513 19.5 10 19.5Z"
              stroke="#242529"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.count}>3</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
  wrapper: {
    marginVertical: 10,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#fff",
    shadowColor: "#4468c1",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.23,
    shadowRadius: 11.27,
    elevation: 10,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  photo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameWrapper: {
    marginHorizontal: 10,
  },
  name: {
    // fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 19.36,
    color: "#242529",
  },
  postedTime: {
    // fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: "200",
    lineHeight: 16.94,
    color: "#848587",
  },
  headerIcons: {
    flexDirection: "row",
    width: "18%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  descriptionTxt: {
    // fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 19.36,
    color: "#242529",
    marginBottom: 15,
  },
  iconsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "20%",
    marginTop: 15,
  },
  bottomIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  count: {
    marginHorizontal: 8,
  },
});
