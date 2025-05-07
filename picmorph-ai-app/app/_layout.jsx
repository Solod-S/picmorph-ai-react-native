import { Stack } from "expo-router";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { UserDetailContext } from "../context/UserDetailContext";
import { useState } from "react";
// import * as SecureStore from "expo-secure-store";

export default function RootLayout() {
  const [userDetail, setUserDetail] = useState();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // const tokenCache = {
  //   async getToken(key) {
  //     try {
  //       const item = await SecureStore.getItemAsync(key);
  //       if (item) {
  //         console.log(`${key} was used 🔒\n`);
  //       } else {
  //         console.log("No values stored under key: " + key);
  //       }
  //       return item;
  //     } catch (error) {
  //       console.error("SecureStore get item error: ", error);
  //       await SecureStore.deleteItemAsync(key);
  //       return null;
  //     }
  //   },
  // };

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
          <Stack
          // screenOptions={{
          //   headerShown: false,
          // }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="formInput" options={{ headerShown: false }} />
          </Stack>
        </UserDetailContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
