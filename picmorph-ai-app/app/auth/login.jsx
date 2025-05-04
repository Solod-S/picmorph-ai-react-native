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
import { useSSO } from "@clerk/clerk-expo";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

const LoginScreen = () => {
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "myapp",
            path: "/(tabs)/home",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);
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
