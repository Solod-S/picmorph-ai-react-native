import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const AiFeaturedModel = () => {
  const [aiModelList, setAiModelList] = useState([]);
  useEffect(() => {
    GetAiFeaturedList();
  }, []);
  const router = useRouter();

  const GetAiFeaturedList = async () => {
    try {
      const result = await GlobalApi.GetFeaturedCategoryList();
      if (result?.data?.data) setAiModelList(result.data.data);
    } catch (error) {
      console.error("Error fetching AI models:", error);
    }
  };

  const OnClickAiModel = item => {
    router?.push({
      pathname: "FormInput",
      params: item,
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>Featured</Text>

      <FlatList
        scrollEnabled={false}
        style={{ marginTop: 10 }}
        data={aiModelList}
        numColumns={4}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => OnClickAiModel(item)}
            style={{ flex: 1, alignItems: "center" }}
          >
            <View
              style={{
                padding: 12,
                borderRadius: 10,
                backgroundColor: "white",
                // iOS shadow
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3.84,
                // Android shadow
                elevation: 5,
              }}
            >
              <Image
                source={{ uri: item?.icon?.url }}
                style={{ width: wp(11), height: wp(11) }}
              />
            </View>
            <Text
              style={{
                fontSize: hp(1.4),
                textAlign: "center",
                color: "#9d9e9d",
                marginTop: 8,
              }}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
