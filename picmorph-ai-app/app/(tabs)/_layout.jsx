import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useContext, useEffect } from "react";
import Colors from "../../constant/Colors";
import GlobalApi from "../../services/GlobalApi";
import { useUser } from "@clerk/clerk-expo";
import { UserDetailContext } from "./../../context/UserDetailContext";

export default function NotificationLayout() {
  const { user } = useUser();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  useEffect(() => {
    user && VerifyUser();
  }, [user]);

  const VerifyUser = async () => {
    try {
      const result = await GlobalApi.GetUserInfo(
        user?.primaryEmailAddress?.emailAddress
      );
      // console.log("User Info", result?.data?.data);
      if (result?.data?.data?.length !== 0) {
        setUserDetail(result?.data?.data[0]);
        return;
      }
      const data = {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,
      };
      const newUser = await GlobalApi.CreateNewUser(data);
      setUserDetail(newUser?.data?.data[0]);
      // console.log(`newUser`, newUser?.data?.data);
    } catch (error) {
      console.log("Error fetching user info", error);
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          // headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          // headerShown: false,
          title: "Collection",
          tabBarIcon: ({ color }) => (
            <Entypo name="folder" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // headerShown: false,
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
