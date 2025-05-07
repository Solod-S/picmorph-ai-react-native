import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

export const TextInputComponent = ({ userInputValue }) => {
  return (
    <View>
      <Text>Enter Your Prompt</Text>
      <TextInput
        onChangeText={value => userInputValue(value)}
        placeholder="Enter your prompt here..."
        numberOfLines={5}
        multiline={true}
        textAlignVertical="top"
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: hp(1.8),
    marginTop: 5,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    minHeight: 100,
  },
  placeholder: {
    color: "#D3D3D3",
  },
});
