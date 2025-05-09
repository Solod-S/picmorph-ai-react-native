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

const FormInputScreen = () => {
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState();
  const [userImage, setUserImage] = useState();
  const [aiModel, setAiModel] = useState();
  const [generatedImage, setGeneratedImage] = useState();

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
    try {
      setLoading(true);

      const data = {
        aiModelName: aiModel?.aiModalName,
        inputPrompt: userInput,
        defaultPrompt: aiModel?.defaultPrompt,
        userImage: userImage,
      };

      const result = await GlobalApi.AIGenerateImage(data);
      const aiImage = result?.data[0];
      console.log(`aiImage`, aiImage);

      if (aiImage) {
        setGeneratedImage(result.data[0]);
        const updatedResult = await GlobalApi.UpdateUserCredits(
          userDetail?.documentId,
          { credits: Number(userDetail?.credits) - 1 }
        );
        updatedResult?.data?.data && setUserDetail(updatedResult?.data?.data);
        const saveImageDate = {
          userEmail: userDetail?.userEmail,
          imageUrl: aiImage,
        };
        const SaveImageResult = await GlobalApi.AddAiImageRecord(saveImageDate);

        router.push({
          pathname: "viewAiImage",
          params: { imageUrl: aiImage, prompt: userInput },
        });
        // console.log(`SaveImageResult`, SaveImageResult?.data?.data);
      }
    } catch (error) {
      console.log("Error generating image:", error);
    } finally {
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
