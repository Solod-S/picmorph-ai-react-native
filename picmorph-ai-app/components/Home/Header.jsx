import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";
import { useUser } from "@clerk/clerk-expo";
import { UserDetailContext } from "../../context/UserDetailContext";

export const Header = () => {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontSize: hp(3.5), color: Colors.PRIMARY, fontWeight: "bold" }}
      >
        Pic Morph AI
      </Text>
      <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            borderWidth: 0.4,
            borderRadius: 99,
            paddingHorizontal: 10,
          }}
        >
          <Image
            source={require("./../../assets/images/credit.png")}
            style={{ width: hp(3.4), height: hp(3.4) }}
          />
          <Text>{userDetail?.credits}</Text>
        </View>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: hp(4.4), height: hp(4.4), borderRadius: 99 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
