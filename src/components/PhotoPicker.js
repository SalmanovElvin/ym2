import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { View, StyleSheet, Button, Image, Text, TextInput } from "react-native";
import { THEME } from "../theme";

export const PhotoPicker = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  const navigation = useNavigation();

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    setImage(result.assets[0].uri);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    setImage(result.assets[0].uri);
  };

  const saveHandler = () => {
    const post = {
      date: new Date().toJSON(),
      text: text,
      img: image,
      booked: false,
    };
    navigation.navigate("Main");
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Создать новый пост</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Введите текст поста..."
        value={text}
        onChangeText={setText}
        multiline
      />
      {image && <Image style={styles.image} source={{ uri: image }} />}

      <View style={styles.btn}>
        <Button title="Сфотографироваться" onPress={openCamera} />
      </View>

      <View style={styles.btn}>
        <Button title="Добавить из альбома" onPress={openImagePicker} />
      </View>
      <Button
        title="Создать пост"
        color={THEME.MAIN_COLOR}
        onPress={saveHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
  },
  btn: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
  },
  textArea: {
    padding: 10,
    marginBottom: 10,
    // borderColor: 'grey',
    // borderWidth: 1,
  },
});
