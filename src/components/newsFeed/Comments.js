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
  Platform,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { GET_NEWS_COMMENT } from "../../../graph/queries/news";

import Svg, {
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
  Rect,
  Ellipse,
} from "react-native-svg";
import {
  LIKE_NEWS_ITEM,
  PIN_NEWS,
  SHOW_PIN,
  NEW_COMMENT,
} from "../../../graph/mutations/news";
import HTMLView from "react-native-htmlview";
import LottieView from "lottie-react-native";

const Comment = (comment) => {
  // console.log(comment.comment);

  // First date: March 2, 2021, at 17:25:02 UTC
  const firstDate = new Date(comment.comment.createdOn);

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
                setPostedTime(`${minutesDifference} minutes`);
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
  return (
    <View style={styles.comment}>
      {comment?.comment?.creator?.profile?.imageURL !== "" ? (
        <Image
          style={{ width: 40, height: 40, borderRadius: 50, marginTop: 5 }}
          source={{ uri: comment?.comment?.creator?.profile?.imageURL }}
        />
      ) : (
        <Svg
          style={{ width: 40, height: 30, borderRadius: 50, marginTop: 5 }}
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
      <View style={{ marginLeft: 10 }}>
        <View style={styles.commentBlock}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#0B0B0B" }}>
            {comment?.comment?.creator?.firstName}{" "}
            {comment?.comment?.creator?.lastName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#242529",
              marginTop: 4,
            }}
          >
            {comment?.comment?.content}
          </Text>
        </View>
        <View style={styles.commentBottom}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#696666",
              marginLeft: 8,
              marginTop: 4,
            }}
          >
            {postedTime}
          </Text>
          {/* <Text>Reply</Text> */}
        </View>
      </View>
    </View>
  );
};

export const Comments = React.memo(({ navigation, route }) => {
  const { news, userData, logoURL, commentCount } = route.params;

  navigation.setOptions({
    headerStyle: {
      backgroundColor: "#fff", // Change the color here
      shadowColor: "#000", // Shadow color
      shadowOffset: {
        width: 0,
        height: 2, // Shadow height
      },
      shadowOpacity: 0.25, // Shadow opacity
      shadowRadius: 3.84, // Shadow radius
      elevation: 5, // Elevation (for Android) // Change the color here
    },
    headerRight: () => (
      <View style={{ flexDirection: "row", marginRight: 10 }}>
        <Svg
          style={{ marginRight: 20 }}
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M23.3611 21.588C22.1684 20.0769 21.3263 19.3077 21.3263 15.1418C21.3263 11.3269 19.4442 9.96779 17.8951 9.30769C17.6894 9.22019 17.4957 9.01923 17.433 8.80048C17.1612 7.84327 16.3995 7 15.3869 7C14.3743 7 13.6121 7.84375 13.3432 8.80144C13.2805 9.0226 13.0868 9.22019 12.881 9.30769C11.3301 9.96875 9.44991 11.3231 9.44991 15.1418C9.44758 19.3077 8.60548 20.0769 7.41269 21.588C6.91848 22.2139 7.35138 23.1538 8.21578 23.1538H22.5627C23.4225 23.1538 23.8526 22.2111 23.3611 21.588Z"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M17.4889 26.0988C18.0464 25.5218 18.3596 24.7391 18.3596 23.9231H12.4142C12.4142 24.7391 12.7274 25.5218 13.2849 26.0988C13.8424 26.6758 14.5985 27 15.3869 27C16.1753 27 16.9314 26.6758 17.4889 26.0988Z"
            fill="#757881"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="20.7955"
            cy="9"
            r="5"
            fill="#ED1717"
            stroke="#F9FAFC"
            strokeWidth="2"
          />
        </Svg>

        <Svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M18.2222 19.3334V21.5556C18.2222 21.8503 18.1052 22.1329 17.8968 22.3413C17.6884 22.5497 17.4058 22.6667 17.1111 22.6667H9.33333L6 26.0001V14.8889C6 14.5943 6.11706 14.3116 6.32544 14.1033C6.53381 13.8949 6.81643 13.7778 7.11111 13.7778H9.33333"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M26 18.2222L22.6667 14.8889H14.8889C14.5942 14.8889 14.3116 14.7718 14.1032 14.5635C13.8948 14.3551 13.7778 14.0725 13.7778 13.7778V7.11111C13.7778 6.81643 13.8948 6.53381 14.1032 6.32544C14.3116 6.11706 14.5942 6 14.8889 6H24.8889C25.1836 6 25.4662 6.11706 25.6746 6.32544C25.8829 6.53381 26 6.81643 26 7.11111V18.2222Z"
            fill="#757881"
            stroke="#757881"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    ),
    headerLeft: () => (
      // <Image style={{ width: 50, height: 35 }} source={logoURL} />
      <TouchableOpacity
        onPress={() => navigation.navigate("FeedsScr")}
        activeOpacity={0.6}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M6.5 1L1.5 6L6.5 11"
            stroke="#242529"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
        <Text
          style={{
            marginLeft: 15,
            fontWeight: "700",
            fontSize: 16,
            color: "#242529",
          }}
        >
          News List
        </Text>
      </TouchableOpacity>
    ),
  });

  const [comments, setComments] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_NEWS_COMMENT, {
    variables: {
      unionID: userData?.unionID,
      newsID: news?.id,
    },
    onCompleted: (data) => {
      // console.log(data.newsComments[0].creator.profile.imageURL);
      setComments(data.newsComments);
      //   console.log(data.newsComments);
      setIsLoaded(true);
    },
    onError: (err) => {
      console.log(err);
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [newCommentContent, setNewCommentContent] = useState("");

  const [addNewComment] = useMutation(NEW_COMMENT, {
    variables: {
      unionID: userData.unionID,
      newsID: news.id,
      comment: {
        content: "" + newCommentContent,
        createdOn: new Date(),
        userID: userData.id,
      },
    },
    onCompleted: () => {},
    onError: (err) => {
      console.log(err);
    },
    // notifyOnNetworkStatusChange: true,
    // refetchQueries: ["newsComments"],
  });

  const sendComment = () => {
    if (newCommentContent.trim().length !== 0) {
      // console.log(newCommentContent);
      setIsLoaded(false);
      addNewComment();
      refetch();
      setNewCommentContent("");
      Keyboard.dismiss();
    }
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
    refetch();
    for (let i = 0; i < news?.likes?.length; i++) {
      if (news.likes[i] == userData.id) {
        setIsLiked(true);
      }
    }

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
                setPostedTime(`${minutesDifference} minutes`);
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

  const [likeCount, setLikeCount] = useState(news.likes?.length);
  const [likeVisible, setLikeVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    if (isLiked == false) {
      likeNewsItem();
      setLikeCount(likeCount + 1);
    }
    setIsLiked(true);
  };

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

  const animationRef = useRef();
  const lastPressRef = useRef(0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 90}
    >
      <ScrollView style={styles.wrapper}>
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
        </View>

        <Text style={styles.descriptionTxt}>
          {Platform.OS === "android" ? (
            news?.content.replace(/<[^>]+>/g, "")
          ) : (
            <HTMLView value={news?.content} />
          )}
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
            <Text style={styles.count}>{comments.length}</Text>
          </View>
        </View>
        <View style={styles.commentWrapper}>
          {!isLoaded ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View>
              {comments == null ? (
                <Text style={styles.commentHeader}>No comments</Text>
              ) : (
                <>
                  <Text style={styles.commentHeader}>Recent comments</Text>
                  <FlatList
                    data={comments}
                    renderItem={({ item }) => <Comment comment={item} />}
                    keyExtractor={(item) => item?.id}
                  />
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.newCommentWrapper}>
        <TextInput
          value={newCommentContent}
          style={styles.newCommentInput}
          onChangeText={setNewCommentContent}
          placeholder="Write a comment"
        />
        <TouchableOpacity onPress={sendComment} activeOpacity={0.6}>
          <Svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Rect width="40" height="40" rx="20" fill="#34519A" />
            <Path
              d="M9.80732 17.8679C9.03653  18.1404 8.94011 19.1901 9.64753 19.5996L14.8199 22.588C14.9498 22.6632 15.099 22.6985 15.2488 22.6897C15.3986 22.6808 15.5426 22.6281 15.6627 22.5381L21.7814 17.9491C21.958 17.8159 22.1822 18.0401 22.0495 18.2173L17.4605 24.3348C17.3705 24.455 17.3179 24.5989 17.309 24.7488C17.3001 24.8986 17.3355 25.0478 17.4107 25.1777L20.4007 30.3528C20.8096 31.0596 21.8594 30.9632 22.1324 30.193L28.2256 12.9967C28.4948 12.2378 27.7625 11.5055 27.003 11.7742L9.80732 17.8679Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
});
const styles = StyleSheet.create({
  newCommentWrapper: {
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    height: 56,
    width: "100%",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  newCommentInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#EAEBF0",
    fontSize: 16,
    fontWeight: "400",
    color: "#696666",
    width: "85%",
  },
  commentWrapper: {
    marginTop: 10,
    marginBottom: 150,
  },
  commentHeader: {
    fontWeight: "500",
    fontSize: 16,
    color: "#0B0B0B",
  },
  comment: {
    marginVertical: 10,
    flexDirection: "row",
    width: "75%",
    alignItems: "flex-start",
  },
  commentBlock: {
    backgroundColor: "#EAEBF0",
    paddingTop: 4,
    paddingHorizontal: 8,
    paddingBottom: 10,
    width: 200,
    borderRadius: 10,
  },
  commentBottom: {},
  lottie: {
    width: 100,
    height: 100,
  },
  wrapper: {
    flexGrow: 1,
    marginTop: 10,
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
    flex: 1,
    fontSize: 14,
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
    marginVertical: 15,
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
