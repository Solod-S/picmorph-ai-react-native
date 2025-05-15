import { ActivityIndicator, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../constant/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Index() {
  const { isLoaded, user } = useUser();

  if (!isLoaded)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.WHITE,
        }}
      >
        <ActivityIndicator color={Colors.PRIMARY} size={wp(15)} />
      </View>
    );

  return <Redirect href={user ? "(tabs)/home" : "auth/login"} />;
}
