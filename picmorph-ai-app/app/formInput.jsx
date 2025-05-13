import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import Colors from "../constant/Colors";
import { ImageUploadComponent, TextInputComponent } from "../components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import GlobalApi from "../services/GlobalApi";
import { UserDetailContext } from "../context/UserDetailContext";
import { upload } from "cloudinary-react-native";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { cld, deleteCloudinaryImage, options } from "../services/Cloudinary";

const FormInputScreen = () => {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [aiModel, setAiModel] = useState();

  useEffect(() => {
    // console.log("params", params);
    navigation.setOptions({
      // headerShown: true,
      headerTitle: params?.name,
      headerShown: true,
      headerBackTitleVisible: false,
      headerBackTitle: "back",
      headerTintColor: "black",
    });
    setAiModel(params);
  }, []);

  const onGenerate = async () => {
    if (userDetail?.credits <= 0 || userDetail?.credits === undefined) {
      Toast.show({
        type: "error",
        position: "top",
        text2: "You Dont Have Enough Credits",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 50,
      });

      return;
    }

    if (
      aiModel?.userImageUpload == "true" ||
      aiModel?.userImageUpload === true
    ) {
      await imageToAIImage();
    } else {
      await textToImage();
    }
  };

  const updateUserCredits = async () => {
    try {
      const updatedResult = await GlobalApi.UpdateUserCredits(
        userDetail?.documentId,
        { credits: Number(userDetail?.credits) - 1 }
      );
      updatedResult?.data?.data && setUserDetail(updatedResult?.data?.data);
    } catch (error) {
      console.log("Error updating user credits:", error);
    }
  };

  const uploadImageAndSave = async aiImageUrl => {
    try {
      // Шаг 1: Скачиваем изображение во временный файл
      const fileUri = `${FileSystem.cacheDirectory}temp-ai-image.jpg`;
      const downloadResult = await FileSystem.downloadAsync(
        aiImageUrl,
        fileUri
      );

      if (!downloadResult || !downloadResult.uri) {
        throw new Error("Failed to download image from URL");
      }

      // Шаг 2: Сжимаем изображение
      const compressedImageResult = await ImageManipulator.manipulateAsync(
        downloadResult.uri,
        [],
        {
          compress: 0.4,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        }
      );
      console.log("Compressed image result:", compressedImageResult);
      // Шаг 3: Загружаем в Cloudinary
      await upload(cld, {
        file: compressedImageResult?.uri,
        options: options,
        callback: async (error, response) => {
          if (error) {
            console.log("Cloudinary upload error:", error);
            return;
          }
          console.log("Uploaded URL:", response?.url);

          // Шаг 4: Сохраняем ссылку в БД
          const saveImageDate = {
            userEmail: userDetail?.userEmail,
            imageUrl: response?.url,
          };
          console.log(`saveImageDate`, saveImageDate);

          await GlobalApi.AddAiImageRecord(saveImageDate);
          router.replace({
            pathname: "viewAiImage",
            params: {
              imageUrl: response?.url,
              prompt: aiModel?.name,
            },
          });
        },
      });
    } catch (error) {
      console.log("Error uploading image:", error);
    }
  };

  const textToImage = async data => {
    try {
      setLoading(true);

      const data = {
        aiModelName: aiModel?.aiModalName,
        inputPrompt: userInput,
        defaultPrompt: aiModel?.defaultPrompt || "",
        userImage: userImage,
      };
      console.log(`aiImage`, data);
      const result = await GlobalApi.AIGenerateImage(data);
      console.log(`aiImage`, data);
      const aiImage =
        typeof result?.data === "object" ? result?.data[0] : result.data;
      console.log(`aiImage`, aiImage);

      if (aiImage) {
        await uploadImageAndSave(aiImage);
        await updateUserCredits();

        router.replace({
          pathname: "viewAiImage",
          params: { imageUrl: aiImage, prompt: userInput },
        });
      } else {
        Toast.show({
          type: "error",
          position: "top",
          text2:
            "Failed to generate the image. Please try a different prompt or try again later.",
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 50,
        });
      }
    } catch (error) {
      console.log("Error generating textToImage:", error);
    } finally {
      setLoading(false);
    }
  };

  const imageToAIImage = async () => {
    try {
      setLoading(true);
      const compressedImageResult = await ImageManipulator.manipulateAsync(
        userImage,
        [], // без действий: [] если только сжатие
        {
          compress: 0.4,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        }
      );

      await upload(cld, {
        file: compressedImageResult?.uri,
        options: options,
        callback: async (error, response) => {
          //.. handle response
          const publicId = response?.public_id;
          console.log(response?.url, " ", publicId); //user image in cloudinary + id

          const data = {
            inputPrompt: aiModel?.defaultPrompt,
            userImageUrl: response?.url,
            main_face_image: response?.url,
            aiModelName: aiModel?.aiModalName,
          };

          const result = await GlobalApi.AIGenerateImage(data);
          await deleteCloudinaryImage(publicId); // delete image from cloudinary
          const aiImage =
            typeof result?.data === "object" ? result?.data[0] : result?.data;
          console.log(`aiImage`, aiImage);

          if (aiImage) {
            await uploadImageAndSave(aiImage);
            await updateUserCredits();

            router.replace({
              pathname: "viewAiImage",
              params: {
                imageUrl: aiImage,
                prompt: aiModel?.name,
              },
            });
            setLoading(false);
          } else {
            Toast.show({
              type: "error",
              position: "top",
              text2:
                "Failed to generate the image. Please try a different photo or try again later.",
              visibilityTime: 2000,
              autoHide: true,
              topOffset: 50,
            });
          }
        },
      });
    } catch (error) {
      console.log("Error generating imageToAIImage:", error);
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        paddingHorizontal: 16,

        backgroundColor: Colors.WHITE,
      }}
    >
      <Text
        style={{ fontSize: hp(3.1), fontWeight: "bold", color: Colors.PRIMARY }}
      >
        {params?.name}
      </Text>
      <View>
        {aiModel?.userImageUpload == "true" ? (
          <ImageUploadComponent uploadedImage={value => setUserImage(value)} />
        ) : (
          <TextInputComponent userInputValue={value => setUserInput(value)} />
        )}
        <Text style={{ marginVertical: 5, color: Colors.GRAY }}>
          NOTE: 1 Credit will use to generate AI Image
        </Text>
        <TouchableOpacity
          disabled={loading}
          onPress={() => onGenerate()}
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 20,
            borderRadius: 40,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.WHITE,
              fontSize: hp(2),
            }}
          >
            Generate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormInputScreen;
