import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

export const ImageUploadComponent = ({ uploadedImage }) => {
  const [image, setImage] = useState();

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      uploadedImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };
  return (
    <View>
      <Text>Upload Your Image</Text>

      <TouchableOpacity
        onPress={pickImageAsync}
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 70,
          // backgroundColor: "lightgray",
          borderColor: Colors.GRAY,
          borderWidth: 0.5,
          borderRadius: 15,
          marginTop: 20,
        }}
      >
        {!image ? (
          <Image
            source={require("./../../assets/images/upload.png")}
            style={{
              width: 70,
              height: 70,
              opacity: 0.5,
            }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 15,
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
