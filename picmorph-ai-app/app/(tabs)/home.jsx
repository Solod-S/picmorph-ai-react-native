import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Header, Banner, AiFeaturedModel } from "../../components";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, padding: 20, marginTop: 20 }}
      edges={["top"]}
    >
      {/* Header */}
      <Header />
      {/* Banner */}
      <Banner />

      <AiFeaturedModel />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
