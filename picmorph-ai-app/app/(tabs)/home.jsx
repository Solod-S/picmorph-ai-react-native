import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Header,
  Banner,
  AiFeaturedModel,
  AiModels,
  AllUsersCreation,
} from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../constant/Colors";

const HomeScreen = () => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.WHITE,
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
      }}
      edges={["top"]}
    >
      <FlatList
        nestedScrollEnabled={true}
        // style={{ padding: 20 }}
        data={[1]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Header />
            <Banner />
            <AiFeaturedModel />
            <AiModels type={"avatar"} />
            <AiModels type={"style"} />

            {/* Users Creation */}
            <AllUsersCreation />
            <View style={{ height: 50 }}></View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
