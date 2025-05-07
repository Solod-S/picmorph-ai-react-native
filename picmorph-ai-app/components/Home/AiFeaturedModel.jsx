import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

export const AiFeaturedModel = () => {
  const [isLoading, setIsLoading] = useState(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const OnClickAiModel = item => {
    router?.push({
      pathname: "formInput",
      params: item,
    });
  };

  const renderSkeleton = () => (
    <View style={{ flex: 1, alignItems: "center", marginBottom: 16 }}>
      <View
        style={{
          padding: 12,
          borderRadius: 10,
          backgroundColor: "#e0e0e0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View
          style={{
            width: wp(11),
            height: wp(11),
            borderRadius: 6,
            backgroundColor: "white",
            opacity: 0.1,
          }}
        />
      </View>
      <View
        style={{
          width: wp(10),
          height: hp(1.4),
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          marginTop: 8,
        }}
      />
    </View>
  );

  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: hp(3.3),
          fontWeight: "bold",
          color: Colors.PRIMARY,
          opacity: 0.7,
        }}
      >
        Featured
      </Text>

      <FlatList
        scrollEnabled={false}
        style={{ marginTop: 10 }}
        data={isLoading ? [1, 2, 3, 4] : aiModelList}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) =>
          isLoading ? (
            renderSkeleton()
          ) : (
            <TouchableOpacity
              onPress={() => OnClickAiModel(item)}
              style={{ flex: 1, alignItems: "center", marginBottom: 16 }}
            >
              <View
                style={{
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Image
                  resizeMode="contain"
                  source={{ uri: item?.icon?.url }}
                  style={{ width: wp(11), height: wp(11), borderRadius: 6 }}
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
          )
        }
      />
    </View>
  );
};
