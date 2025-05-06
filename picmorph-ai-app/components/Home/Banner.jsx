import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

export const Banner = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={require("./../../assets/images/banner2.jpg")}
      />

      <View style={styles.overlay} />

      <View style={styles.textContainer}>
        <Text style={styles.whiteText}>From Words</Text>
        <Text style={styles.redText}>to Wonders</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Explore</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: hp(20),
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: hp(20),
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
  },
  textContainer: {
    position: "absolute",
    top: 20,
    left: 15,
  },
  whiteText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.WHITE,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  redText: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.PRIMARY,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    position: "absolute",
    bottom: 10,
    right: 15,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    // fontWeight: "bold",
  },
});
