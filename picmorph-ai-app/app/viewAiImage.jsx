import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

export default function ViewAiImage() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "View Ai generated Image",
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
      if (!status?.granted) {
        const permissionResp = await requestPermission();
        if (!permissionResp?.granted) {
          // ToastAndroid.show("No Permssion to download", ToastAndroid.SHORT);
          Toast.show({
            type: "error",
            position: "top",
            text2: "No Permssion to download",
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 50,
          });
          return;
        }
      }

      const fileUri =
        FileSystem.documentDirectory + Date.now() + "_IngenAI.jpg";
      const { uri } = await FileSystem.downloadAsync(params?.imageUrl, fileUri);

      //save to gallery
      const asset = await MediaLibrary.createAssetAsync(uri);
      if (asset) {
        // ToastAndroid.show("Image Downloaded", ToastAndroid.SHORT);
        Toast.show({
          type: "success",
          position: "top",
          text2: "Image Downloaded",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
      } else {
        // ToastAndroid.show("Error", ToastAndroid.SHORT);
        Toast.show({
          type: "error",
          position: "top",
          text2: "Error",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
      }
    } catch (e) {
      console.error("Error downloading image:", e);
      // ToastAndroid.show("Error downloading image", ToastAndroid.SHORT);
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
  return (
    <View style={{ padding: 20 }}>
      <Image
        source={{ uri: params?.imageUrl }}
        style={{ width: "100%", height: 400, borderRadius: 20 }}
      />
      <Text
        style={{
          marginVertical: 10,
          fontSize: 22,
          color: "black",
          fontWeight: "800",
        }}
      >
        Prompt: {params?.prompt}{" "}
      </Text>

      <Text
        style={{
          marginVertical: 20,
          fontSize: 16,
          color: "grey",
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
            backgroundColor: "black",
            borderRadius: 10,
            alignItems: "center",
            width: "50%",
          }}
          onPress={downloadImage}
        >
          <Text
            style={{
              fontSize: 18,
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
            backgroundColor: "black",
            borderRadius: 10,
            alignItems: "center",
            width: "50%",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "aqua",
            }}
          >
            share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
