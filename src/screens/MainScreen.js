import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";

// import { DATA } from '../data';
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { AppHeaderIcon } from "../components/AppHeaderIcon";
import { Post } from "../components/Post";
import { loadPosts } from "../store/actions/post";

export const MainScreen = ({ navigation }) => {
  // const navigator = useNavigation();

  navigation.setOptions({
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
        <Item
          title="Take Photo"
          iconName="camera"
          onPress={() => {
            navigation.navigate('Create')
          }}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={AppHeaderIcon}>
        <Item
          title="Toggle Drawer"
          iconName="menu"
          onPress={() => navigation.toggleDrawer()}
        />
      </HeaderButtons>
    ),
  });

  const openPostHandler = (post) => {
    navigation.navigate("Post", { post });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadPosts())
  }, [dispatch])

  const allPosts = useSelector(state => state.post.allPosts)

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={allPosts}
        keyExtractor={(post) => post.id.toString()}
        renderItem={({ item }) => <Post post={item} onOpen={openPostHandler} />}
      />
      {/* <Button title="Open Post Screen" onPress={() => navigator.navigate('Post')} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
});
