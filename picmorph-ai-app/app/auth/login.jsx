import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useOAuth } from "@clerk/clerk-expo";
import { useSSO } from "@clerk/clerk-expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

const LoginScreen = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startSSOFlow } = useSSO();

  const onPress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: "myapp",
          path: "/(tabs)/home",
        }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      } else {
        console.log("User did not complete the login process.");
      }
    } catch (err) {
      console.log("OAuth error", err);
    }
  };

  return (
    <View edges={["top"]} style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={{ width: "100%", height: hp(60) }}
        source={require("./../../assets/images/logren.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to PicMorph AI</Text>
        <Text
          style={{ color: Colors.GRAY, textAlign: "center", marginTop: 15 }}
        >
          Create AI Art in Just on Click
        </Text>
        <TouchableOpacity onPress={() => onPress()} style={styles.button}>
          <Text
            style={{
              textAlign: "center",
              color: Colors.WHITE,
              fontSize: hp(2),
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            marginTop: "20",
            fontSize: hp(1.4),
            color: Colors.GRAY,
          }}
        >
          By continuing, you agree to our Terms and Privacy Policy.
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  textContainer: {
    padding: 25,
    marginTop: -20,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
  },
  title: {
    fontSize: hp(3.2),
    textAlign: "center",
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 40,
    marginTop: 20,
  },
});

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();
