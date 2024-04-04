import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, Button, ScrollView, Alert } from "react-native";

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { AppHeaderIcon } from "../components/AppHeaderIcon";
// import { DATA } from "../data";
import { THEME } from '../theme';
import { removePost, toggleBooked } from "../store/actions/post";

export const PostScreen = ({ navigation, route: { params: { post } } }) => {

  const dispatch = useDispatch();

  const toggleHandler = useCallback(
    () => {
      dispatch(toggleBooked(post.id));
    }, [dispatch, post.id]
  )
  useEffect(() => {
    navigation.setParams({ toggleHandler })
  }, [toggleHandler])

  const booked = useSelector(state => state.post.bookedPosts.some(item => item.id === post.id));

  useEffect(()=>{
    navigation.setParams({booked})
  },[booked])

  const iconName = post.booked ? 'star' : 'star-outline';

  navigation.setOptions({
    title: `Пост от ${new Date(post.date).toLocaleDateString()}`,
    headerRight: () => <HeaderButtons HeaderButtonComponent={AppHeaderIcon}><Item title="like" iconName={iconName} onPress={toggleHandler} /></HeaderButtons>,
  });

  // это для разнообразия так написал, в принципе можно было передать весь обьект как пропс с МоинСкрина.
  // const post = DATA.find(p => p.id === postId);


  const removeHandler = () => {
    Alert.alert('Удаление поста', 'Вы точно хотите удалит пост?', [
      {
        text: 'Отменить',
        style: 'cancel',
      },
      { text: 'Удалить', style: 'distructive', onPress: () => { 
        navigation.navigate('Main');
        dispatch(removePost(post.id));
       } },
    ], { cancelable: false });
  }

  // if(!post){
  //   return null
  // }

  return (
    <ScrollView>
      <Image source={{ uri: post.img }} style={styles.image} />
      <View style={styles.textWrap}>
        <Text style={styles.title}>
          {post.text}
        </Text>
      </View>
      <Button title='Удалить' color={THEME.DANGER_COLOR} onPress={removeHandler} />
    </ScrollView>)
};


const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200
  },
  textWrap: {
    padding: 10,

  },
  title: {
  }
});
