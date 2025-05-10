import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Linking,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import Colors from "../constant/Colors";

export default function ViewAiImage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Image View",
      headerShown: true,
      headerBackTitleVisible: false,
      headerBackTitle: "back",
      headerTintColor: "black",
    });
  }, []);

  const ShareImage = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        // ToastAndroid.show("Sharing is not available", ToastAndroid.SHORT);
        Toast.show({
          type: "error",
          position: "top",
          text2: "Sharing is not available",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        return;
      }

      const uniqueFileName = `SharedImage_${Date.now()}.jpg`;
      const fileUri = FileSystem.cacheDirectory + uniqueFileName;

      const { uri } = await FileSystem.downloadAsync(params.imageUrl, fileUri);
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        // ToastAndroid.show("Downloaded file not found", ToastAndroid.SHORT);
        Toast.show({
          type: "error",
          position: "top",
          text2: "Downloaded file not found",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        return;
      }

      console.log("Downloaded file info:", fileInfo);

      await Sharing.shareAsync(uri, {
        mimeType: "image/jpeg",
        dialogTitle: "Share this AI-generated image",
        UTI: "public.jpeg",
      });
    } catch (error) {
      console.error("Error sharing image:", error);
      // ToastAndroid.show("Failed to share image", ToastAndroid.SHORT);
      Toast.show({
        type: "error",
        position: "top",
        text2: "Failed to share image",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  const downloadImage = async () => {
    try {
      let permission = status;

      // const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      // console.log("permission!", { status, canAskAgain });

      // if (!permission || !permission.granted) {
      //   permission = await requestPermission();
      // }

      // if (status === "denied" && !canAskAgain) {
      //   Linking.openSettings(); // Открывает настройки приложения
      // }
      // ⚠️ Expo Go не работает с пермишенами WRITE/READ, только через eas build

      if (!permission || !permission.granted) {
        permission = await requestPermission();
      }

      if (!permission.granted) {
        Toast.show({
          type: "error",
          position: "top",
          text2: "No permission to download",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
        return;
      }

      const fileUri =
        FileSystem.documentDirectory + Date.now() + "_IngenAI.jpg";
      const { uri } = await FileSystem.downloadAsync(params?.imageUrl, fileUri);

      const asset = await MediaLibrary.createAssetAsync(uri);
      if (asset) {
        Toast.show({
          type: "success",
          position: "top",
          text2: "Image Downloaded",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text2: "Error saving image",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
      }
    } catch (e) {
      console.error("Error downloading image:", e);
      Toast.show({
        type: "error",
        position: "top",
        text2: "Error downloading image",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  // const downloadImage = async () => {
  //   try {
  //     if (!status?.granted) {
  //       const permissionResp = await requestPermission();
  //       if (!permissionResp?.granted) {
  //         // ToastAndroid.show("No Permssion to download", ToastAndroid.SHORT);
  //         Toast.show({
  //           type: "error",
  //           position: "top",
  //           text2: "No Permssion to download",
  //           visibilityTime: 2000,
  //           autoHide: true,
  //           topOffset: 50,
  //         });
  //         return;
  //       }
  //     }

  //     const fileUri =
  //       FileSystem.documentDirectory + Date.now() + "_IngenAI.jpg";
  //     const { uri } = await FileSystem.downloadAsync(params?.imageUrl, fileUri);

  //     //save to gallery
  //     const asset = await MediaLibrary.createAssetAsync(uri);
  //     if (asset) {
  //       // ToastAndroid.show("Image Downloaded", ToastAndroid.SHORT);
  //       Toast.show({
  //         type: "success",
  //         position: "top",
  //         text2: "Image Downloaded",
  //         visibilityTime: 2000,
  //         autoHide: true,
  //         topOffset: 50,
  //       });
  //     } else {
  //       // ToastAndroid.show("Error", ToastAndroid.SHORT);
  //       Toast.show({
  //         type: "error",
  //         position: "top",
  //         text2: "Error",
  //         visibilityTime: 2000,
  //         autoHide: true,
  //         topOffset: 50,
  //       });
  //     }
  //   } catch (e) {
  //     console.error("Error downloading image:", e);
  //     // ToastAndroid.show("Error downloading image", ToastAndroid.SHORT);
  //     Toast.show({
  //       type: "error",
  //       position: "top",
  //       text2: "Error downloading image",
  //       visibilityTime: 2000,
  //       autoHide: true,
  //       topOffset: 50,
  //     });
  //   }
  // };
  return (
    <View style={{ padding: 20, backgroundColor: Colors.WHITE, flex: 1 }}>
      <Image
        source={{ uri: params?.imageUrl }}
        style={{ width: "100%", height: 400, borderRadius: 20 }}
      />
      <Text
        style={{
          marginTop: 10,
          fontSize: hp(2.5),
          color: "black",
          fontWeight: "800",
        }}
      >
        Prompt: {params?.prompt}{" "}
      </Text>

      <Text
        style={{
          marginVertical: 20,
          fontSize: hp(1.8),
          color: Colors.RED,
        }}
      >
        Note Image available for next 30 minutes{" "}
      </Text>

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: Colors.PRIMARY,
            borderRadius: 10,
            alignItems: "center",
            width: "50%",
          }}
          onPress={downloadImage}
        >
          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              color: "white",
            }}
          >
            Download
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ShareImage}
          style={{
            padding: 15,
            // backgroundColor: "black",
            borderWidth: 2,
            borderColor: Colors.PRIMARY,
            borderRadius: 10,
            alignItems: "center",
            width: "50%",
          }}
        >
          <Text
            style={{
              fontSize: hp(2),
              fontWeight: "bold",
              color: Colors.PRIMARY,
            }}
          >
            share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
