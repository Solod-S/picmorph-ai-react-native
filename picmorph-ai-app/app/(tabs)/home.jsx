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

const HomeScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        marginTop: 20,
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
            <View style={{ height: 100 }}></View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
