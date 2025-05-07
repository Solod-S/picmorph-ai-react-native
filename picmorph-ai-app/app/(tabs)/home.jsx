import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Header, Banner, AiFeaturedModel, AiModels } from "../../components";
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header />
        {/* Banner */}
        <Banner />
        {/* Ai Featured Model */}
        <AiFeaturedModel />
        {/* AI Models */}
        <AiModels type={"avatar"} />
        <AiModels type={"style"} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
