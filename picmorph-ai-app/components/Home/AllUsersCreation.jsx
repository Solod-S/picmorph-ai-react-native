import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../services/GlobalApi";
import { useFocusEffect, useRouter } from "expo-router";
import Colors from "../../constant/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const AllUsersCreation = () => {
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [aiImageList, setAiImageList] = useState([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      setAiImageList([]);
      GetAllAiImages(pageSize);
    }, [])
  );

  const GetAllAiImages = async size => {
    try {
      setLoading(true);
      const result = await GlobalApi.GetAllAiImages(size);

      const resultData = result?.data?.data;
      if (resultData) {
        resultData?.forEach(element => {
          setAiImageList(prev => [...prev, element]);
        });
        setPageSize(size);
      }
    } catch (error) {
      console.error("Error fetching AI images:", error);
    } finally {
      setLoading(false);
    }
  };

  const onImageClick = item => {
    router.push({
      pathname: "viewAiImage",
      params: {
        imageUrl: item?.imageUrl,
        prompt: "hidden",
      },
    });
  };

  const renderSkeleton = () =>
    [...Array(4)].map((_, index) => (
      <View
        key={`skeleton-${index}`}
        style={{
          width: wp(50) - 8 - 16,
          height: 250,
          margin: 4,
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
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: hp(3.3),
          fontWeight: "bold",
          color: Colors.PRIMARY,
          opacity: 0.7,
        }}
      >
        USER&apos; CREATION
      </Text>

      <FlatList
        data={loading && aiImageList.length === 0 ? [1, 2, 3, 4] : aiImageList}
        style={{}}
        numColumns={2}
        onEndReached={() => GetAllAiImages(pageSize + 5)}
        onEndReachedThreshold={0.7}
        renderItem={({ item, index }) =>
          loading && aiImageList.length === 0 ? (
            renderSkeleton()[index]
          ) : (
            <TouchableOpacity
              style={{ margin: 4 }}
              onPress={() => onImageClick(item)}
            >
              <Image
                source={{ uri: item?.imageUrl }}
                style={{
                  width: wp(50) - 8 - 16,
                  height: 250,
                  borderRadius: 15,
                }}
              />
            </TouchableOpacity>
          )
        }
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};
