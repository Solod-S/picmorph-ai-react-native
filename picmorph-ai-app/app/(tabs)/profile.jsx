import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constant/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      router.replace("auth/login");
    }
  };

  const handleGoToGallery = () => {
    router.push("/collection"); //
  };

  if (!isLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.PRIMARY} size={wp(15)} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={{ alignItems: "center" }}>
        {user?.imageUrl && (
          <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
        )}

        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <TouchableOpacity onPress={handleGoToGallery} style={styles.button}>
        <Text style={styles.buttonText}>Go to My Gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.button, styles.logoutButton]}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: hp(3.2),
    textAlign: "center",
    color: Colors.BLACK,
    fontWeight: "bold",
  },
  email: {
    fontSize: hp(2),
    textAlign: "center",
    color: Colors.GRAY,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 40,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.WHITE,
    fontSize: hp(2),
  },
  logoutButton: {
    backgroundColor: Colors.RED,
    padding: 20,
    borderRadius: 40,
    marginTop: 20,
  },
  logoutText: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.WHITE,
    fontSize: hp(2),
  },
});
