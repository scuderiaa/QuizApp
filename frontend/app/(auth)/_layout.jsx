import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="questions"
        options={{ headerShown: false, title: "Questions" }}
      />
      <Stack.Screen
        name="AdminPanel"
        options={{ headerShown: false, title: "Admin Panel" }}
      />
    </Stack>
  );
};

export default _layout;
