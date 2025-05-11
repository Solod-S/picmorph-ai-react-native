import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../../constant/Colors";

export const AiModels = ({ type }) => {
  const router = useRouter();
  const [aiModelList, setAiModelList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetAiModels();
  }, []);

  const GetAiModels = async () => {
    try {
      const result = await GlobalApi.GetAiModels(type);
      setAiModelList(result.data.data);
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

  const renderSkeleton = () =>
    [...Array(4)].map((_, index) => (
      <View
        key={index}
        style={{
          width: 140,
          height: 180,
          marginRight: 20,
          borderRadius: 15,
          backgroundColor: "#e0e0e0",
          // iOS shadow
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          // Android shadow
          elevation: 5,
        }}
      />
    ));

  return (
    <View>
      <Text
        style={{
          fontSize: hp(2.5),
          fontWeight: "bold",
          color: Colors.PRIMARY,
          opacity: 0.7,
          marginTop: 10,
        }}
      >
        {type?.toUpperCase()}
      </Text>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <FlatList
          style={{ marginTop: 10 }}
          data={isLoading ? [1, 2, 3, 4] : aiModelList}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) =>
            isLoading ? (
              renderSkeleton()[index]
            ) : (
              <TouchableOpacity
                onPress={() => OnClickAiModel(item)}
                style={{
                  marginRight: 20,
                  borderRadius: 15,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Image
                  resizeMode="cover"
                  source={{ uri: item?.icon?.url }}
                  style={{
                    width: 140,
                    height: 180,
                    borderRadius: 15,
                  }}
                />
                <Text
                  style={{
                    position: "absolute",
                    bottom: 10,
                    color: "white",
                    fontWeight: "bold",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  {item?.name}
                </Text>
              </TouchableOpacity>
            )
          }
        />
      </View>
    </View>
  );
};
