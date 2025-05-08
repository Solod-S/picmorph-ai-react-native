import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Colors from "../constant/Colors";
import { ImageUploadComponent, TextInputComponent } from "../components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import GlobalApi from "../services/GlobalApi";

const FormInputScreen = () => {
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
      console.log(`result`, result.data);
      result?.data?.length > 0 && setGeneratedImage(result.data[0]);
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
