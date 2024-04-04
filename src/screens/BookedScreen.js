import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import { useSelector } from "react-redux";

// import { DATA } from '../data';

import { Post } from "../components/Post";

export const BookedScreen = ({ navigation }) => {

  const openPostHandler = post => {
    navigation.navigate('Post', { post });
  }

  const bookedPosts=useSelector(state=>state.post.bookedPosts);

  return (
    <View style={styles.wrapper}>
      <FlatList data={bookedPosts.filter(post=>post.booked)} keyExtractor={post => post.id.toString()} renderItem={({ item }) => <Post post={item} onOpen={openPostHandler} />} />
    </View>
  )
};


const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});
